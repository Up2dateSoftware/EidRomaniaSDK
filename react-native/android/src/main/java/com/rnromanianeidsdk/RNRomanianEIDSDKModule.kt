package com.rnromanianeidsdk

import android.nfc.NfcAdapter
import android.nfc.Tag
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.up2date.eidromania.eidromaniasdk.AuthenticationResult
import com.up2date.eidromania.eidromaniasdk.EIDRomaniaSDK
import com.up2date.eidromania.eidromaniasdk.EIDReaderConfig
import com.up2date.eidromania.eidromaniasdk.EIDReaderError
import com.up2date.eidromania.eidromaniasdk.EIDReaderLogger
import com.up2date.eidromania.eidromaniasdk.EIDRomaniaReader
import com.up2date.eidromania.eidromaniasdk.NFCManager
import com.up2date.eidromania.eidromaniasdk.data.RomanianElectronicIdentityCard
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeout
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * React Native bridge for RomanianEIDSDK Android
 *
 * This module provides access to the native Android SDK for reading Romanian eID cards.
 * It handles initialization, NFC card reading, and event emission for progress updates.
 */
class RNRomanianEIDSDKModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "RNRomanianEIDSDK"
        private const val MODULE_NAME = "RomanianEIDSDK"

        // Event names
        private const val EVENT_READ_PROGRESS = "onReadProgress"
        private const val EVENT_READ_COMPLETE = "onReadComplete"
        private const val EVENT_READ_ERROR = "onReadError"
    }

    private val nfcAdapter: NfcAdapter? = NfcAdapter.getDefaultAdapter(reactContext)
    private val reader: EIDRomaniaReader
    private var isInitialized = false

    // Coroutine scope for async operations
    private val moduleScope = CoroutineScope(Dispatchers.Main + Job())
    private var readingJob: Job? = null

    init {
        // Initialize reader with config
        val config = EIDReaderConfig(
            logger = object : EIDReaderLogger {
                override fun log(level: EIDReaderLogger.Level, message: String, throwable: Throwable?) {
                    when (level) {
                        EIDReaderLogger.Level.DEBUG -> Log.d(TAG, message, throwable)
                        EIDReaderLogger.Level.INFO -> Log.i(TAG, message, throwable)
                        EIDReaderLogger.Level.WARNING -> Log.w(TAG, message, throwable)
                        EIDReaderLogger.Level.ERROR -> Log.e(TAG, message, throwable)
                    }
                }
            },
            maxRetries = 2,
            timeoutMillis = 20000,
            maxImageSizeBytes = 300 * 1024
        )

        reader = EIDRomaniaReader(config)

        // Note: NFCLifecycleManager is registered in RNRomanianEIDSDKPackage.createNativeModules()
        // to ensure it's registered early during app startup, before any methods are called
    }

    override fun getName(): String = MODULE_NAME

    override fun getConstants(): Map<String, Any> = mapOf(
        "VERSION" to "1.0.0",
        "EVENT_READ_PROGRESS" to EVENT_READ_PROGRESS,
        "EVENT_READ_COMPLETE" to EVENT_READ_COMPLETE,
        "EVENT_READ_ERROR" to EVENT_READ_ERROR
    )

    /**
     * Send event to React Native JavaScript
     */
    private fun sendEvent(eventName: String, params: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    /**
     * Initialize SDK with license key
     */
    @ReactMethod
    fun initialize(license: String, promise: Promise) {
        try {
            Log.d(TAG, "Initializing eID Romania SDK...")

            EIDRomaniaSDK.initialize(reactContext, license)

            if (!EIDRomaniaSDK.isInitialized()) {
                promise.reject("INIT_ERROR", "SDK failed to initialize")
                return
            }

            if (!EIDRomaniaSDK.isLicenseValid()) {
                promise.reject("INVALID_LICENSE", "License is invalid or expired")
                return
            }

            isInitialized = true
            Log.i(TAG, "SDK initialized successfully")
            promise.resolve(true)

        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize SDK", e)
            promise.reject("INIT_ERROR", "Failed to initialize SDK: ${e.message}", e)
        }
    }

    /**
     * Read ID card via NFC using CAN + PIN
     *
     * @param can - Card Access Number (6 digits)
     * @param pin - Personal PIN (4 digits)
     * @param options - { readPhoto: boolean, readSignature: boolean, enableCSCAValidation: boolean, timeout: number }
     */
    @ReactMethod
    fun readIDCard(can: String, pin: String, options: ReadableMap, promise: Promise) {
        try {
            // Check if SDK is initialized
            if (!isInitialized) {
                promise.reject("NOT_INITIALIZED", "SDK not initialized. Call initialize() first.")
                return
            }

            // Verify NFC is available
            if (nfcAdapter == null || !nfcAdapter.isEnabled) {
                promise.reject("NFC_NOT_AVAILABLE", "NFC is not available or disabled")
                return
            }

            // Validate CAN and PIN format
            if (can.trim().length != 6 || !can.trim().matches(Regex("\\d+"))) {
                promise.reject("INVALID_CAN", "CAN must be 6 digits")
                return
            }

            if (pin.trim().length != 4 || !pin.trim().matches(Regex("\\d+"))) {
                promise.reject("INVALID_PIN", "PIN must be 4 digits")
                return
            }

            // Parse options
            val readPhoto = if (options.hasKey("readPhoto")) options.getBoolean("readPhoto") else true
            val readSignature = if (options.hasKey("readSignature")) options.getBoolean("readSignature") else true

            // Cancel previous reading job if any
            readingJob?.cancel()

            // Start reading in coroutine
            readingJob = moduleScope.launch {
                try {
                    Log.d(TAG, "Starting ID card reading...")

                    // Wait for NFC tag
                    sendProgressEvent(0, "Waiting for card...")
                    NFCManager.startWaitingForTag()

                    val tag = try {
                        withTimeout(30000) {
                            NFCManager.currentTag.first { it != null }
                        }
                    } catch (e: Exception) {
                        promise.reject("TIMEOUT", "Timeout waiting for card. Please bring card closer.")
                        NFCManager.stopWaitingForTag()
                        return@launch
                    }

                    if (tag == null) {
                        promise.reject("TIMEOUT", "Timeout waiting for card. Please bring card closer.")
                        NFCManager.stopWaitingForTag()
                        return@launch
                    }

                    sendProgressEvent(10, "Card detected, starting reading...")

                    // Log authentication info (without revealing actual values)
                    Log.d(TAG, "Reading card with CAN length: ${can.trim().length}, PIN length: ${pin.trim().length}")
                    Log.d(TAG, "Read options: photo=$readPhoto, signature=$readSignature")

                    // Start progress monitoring in background
                    val progressJob = launch {
                        reader.readingProgress.collectLatest { progress ->
                            sendProgressEvent(progress.percentage, progress.description)
                        }
                    }

                    // Read card using SDK v1.5.3 API
                    val result = reader.read(
                        nfcTag = tag,
                        can = can.trim(),
                        pin = pin.trim(),
                        readProfileImage = readPhoto,
                        readSignatureImage = readSignature
                    )

                    Log.d(TAG, "Card reading completed, processing result...")

                    // Stop progress monitoring
                    progressJob.cancel()

                    // Process result using fold() - the Kotlin Result API
                    result.fold(
                        onSuccess = { card ->
                            // Create separate maps for event and promise result
                            // WritableMap can only be consumed once!
                            val cardMapForEvent = convertCardToMap(card)
                            val cardMapForPromise = convertCardToMap(card)

                            // Send completion event
                            try {
                                val completeEvent = Arguments.createMap()
                                completeEvent.putMap("result", cardMapForEvent)
                                sendEvent(EVENT_READ_COMPLETE, completeEvent)
                            } catch (e: Exception) {
                                Log.w(TAG, "Failed to send completion event: ${e.message}")
                            }

                            promise.resolve(cardMapForPromise)
                        },
                        onFailure = { error ->
                            // Log detailed error information for debugging
                            Log.e(TAG, "Card reading failed with error: ${error.javaClass.simpleName}")
                            Log.e(TAG, "Error message: ${error.message}")
                            Log.e(TAG, "Error stack trace:", error)

                            val errorMessage = handleError(error)
                            val errorCode = getErrorCode(error)

                            // Send error event
                            try {
                                val errorEvent = Arguments.createMap()
                                errorEvent.putString("code", errorCode)
                                errorEvent.putString("message", errorMessage)
                                sendEvent(EVENT_READ_ERROR, errorEvent)
                            } catch (e: Exception) {
                                Log.w(TAG, "Failed to send error event: ${e.message}")
                            }

                            promise.reject(errorCode, errorMessage)
                        }
                    )

                } catch (e: Exception) {
                    Log.e(TAG, "Unexpected error reading ID card", e)
                    promise.reject("READ_ERROR", "Unexpected error: ${e.message}", e)
                } finally {
                    NFCManager.stopWaitingForTag()
                    NFCManager.clearTag()
                }
            }

        } catch (e: Exception) {
            Log.e(TAG, "Failed to start ID card reading", e)
            promise.reject("READ_IDCARD_ERROR", e.message, e)
        }
    }

    /**
     * Read passport via NFC using MRZ key
     * Note: This requires passport reading feature to be implemented in the native SDK
     *
     * @param mrzKey - Format: DocumentNumber + DOB + Expiry (with check digits)
     * @param options - { enableCSCAValidation: boolean, timeout: number }
     */
    @ReactMethod
    fun readPassport(mrzKey: String, options: ReadableMap, promise: Promise) {
        // Note: Passport reading is not yet implemented in the Android SDK
        promise.reject(
            "NOT_IMPLEMENTED",
            "Passport reading is not yet implemented for Android. Use iOS or wait for future Android SDK update."
        )
    }

    /**
     * Start MRZ scanning with camera
     * Note: This requires camera and MRZ scanning to be implemented
     */
    @ReactMethod
    fun startMRZScanning(promise: Promise) {
        // Note: MRZ scanning is not yet implemented in the Android SDK
        promise.reject(
            "NOT_IMPLEMENTED",
            "MRZ scanning is not yet implemented for Android. Use iOS or wait for future Android SDK update."
        )
    }

    /**
     * Start OCR scanning with camera (for old ID cards without NFC)
     * Note: This requires OCR functionality to be implemented
     */
    @ReactMethod
    fun startOCRScanning(promise: Promise) {
        // Note: OCR scanning is not yet implemented in the Android SDK
        promise.reject(
            "NOT_IMPLEMENTED",
            "OCR scanning is not yet implemented for Android. Use iOS or wait for future Android SDK update."
        )
    }

    /**
     * Check if NFC is available on device
     */
    @ReactMethod
    fun isNFCAvailable(promise: Promise) {
        try {
            val available = nfcAdapter != null && nfcAdapter.isEnabled
            promise.resolve(available)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message, e)
        }
    }

    /**
     * Get license information
     */
    @ReactMethod
    fun getLicenseInfo(promise: Promise) {
        try {
            if (!isInitialized) {
                promise.reject("NOT_INITIALIZED", "SDK not initialized")
                return
            }

            val info = Arguments.createMap()

            when (val status = EIDRomaniaSDK.getLicenseStatus()) {
                is EIDRomaniaSDK.LicenseStatus.Active -> {
                    info.putBoolean("isValid", true)
                    info.putString("status", "active")
                    info.putString("expiresAt", status.expiryDate)
                    info.putInt("daysRemaining", status.daysRemaining)
                }
                is EIDRomaniaSDK.LicenseStatus.Expired -> {
                    info.putBoolean("isValid", false)
                    info.putString("status", "expired")
                    info.putString("expiredOn", status.expiredOn)
                }
                is EIDRomaniaSDK.LicenseStatus.Invalid -> {
                    info.putBoolean("isValid", false)
                    info.putString("status", "invalid")
                    info.putString("reason", status.reason)
                }
                else -> {
                    info.putBoolean("isValid", false)
                    info.putString("status", "not_activated")
                }
            }

            promise.resolve(info)
        } catch (e: Exception) {
            promise.reject("LICENSE_ERROR", "Failed to get license info: ${e.message}", e)
        }
    }

    // ========== Helper Methods ==========

    /**
     * Send progress event to React Native
     */
    private fun sendProgressEvent(percentage: Int, message: String) {
        try {
            val event = Arguments.createMap()
            event.putInt("percentage", percentage)
            event.putString("message", message)
            sendEvent(EVENT_READ_PROGRESS, event)
        } catch (e: Exception) {
            Log.w(TAG, "Failed to send progress event: ${e.message}")
        }
    }

    /**
     * Convert RomanianElectronicIdentityCard to WritableMap
     * Updated for SDK v1.5.3 - handles Date objects, authentication result, and new field names
     */
    private fun convertCardToMap(card: RomanianElectronicIdentityCard): WritableMap {
        val map = Arguments.createMap()

        // Personal data
        map.putString("cnp", card.cnp)
        map.putString("surname", card.surname)
        map.putString("givenNames", card.givenNames)
        map.putString("fullName", "${card.surname} ${card.givenNames}")

        // Date fields now return Date objects in v1.3.0
        card.dateOfBirth?.let {
            map.putString("dateOfBirth", formatDate(it))
        }

        map.putString("placeOfBirth", card.placeOfBirth)
        map.putString("sex", card.sex)
        map.putString("nationality", card.nationality)

        // Document data
        map.putString("documentNumber", card.documentNumber)
        map.putString("documentType", card.documentType)

        // Date fields now return Date objects in v1.5.3
        card.dateOfIssue?.let {
            map.putString("dateOfIssue", formatDate(it))
        }
        card.dateOfExpiry?.let {
            map.putString("dateOfExpiry", formatDate(it))
        }

        map.putString("issuingAuthority", card.issuingAuthority)

        // Address data - v1.3.0 uses addressString property
        card.addressString?.let {
            if (it.isNotEmpty()) {
                map.putString("address", it)
            }
        }

        // Biometric data - v1.3.0 stores images as base64 strings
        card.facialImageBase64?.let {
            if (it.isNotEmpty()) {
                map.putString("facialImageBase64", it)
            }
        }

        card.signatureImageBase64?.let {
            if (it.isNotEmpty()) {
                map.putString("signatureImageBase64", it)
            }
        }

        // Authentication result (CSCA validation) - NEW in SDK v1.5.3
        card.authenticationResult?.let { authResult ->
            val authMap = Arguments.createMap()
            when (authResult) {
                is AuthenticationResult.Authentic -> {
                    authMap.putString("status", "authentic")
                    authMap.putString("message", authResult.message)
                }
                is AuthenticationResult.Failed -> {
                    authMap.putString("status", "failed")
                    authMap.putString("reason", authResult.reason)
                    authResult.details?.let { details ->
                        authMap.putString("details", details)
                    }
                }
                is AuthenticationResult.Warning -> {
                    authMap.putString("status", "warning")
                    authMap.putString("message", authResult.message)
                    authResult.details?.let { details ->
                        authMap.putString("details", details)
                    }
                }
            }
            map.putMap("authenticationResult", authMap)
        }

        return map
    }

    /**
     * Format Date object to ISO 8601 string (YYYY-MM-DD)
     */
    private fun formatDate(date: Date): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        return sdf.format(date)
    }

    /**
     * Handle SDK errors and convert to user-friendly messages
     */
    private fun handleError(error: Throwable): String {
        return when (error) {
            is EIDReaderError.InvalidPIN -> {
                if (error.attemptsRemaining != null) {
                    "PIN incorect. Mai aveți ${error.attemptsRemaining} încercări."
                } else {
                    "PIN incorect. Verificați codul PIN de 4 cifre."
                }
            }
            is EIDReaderError.InvalidCAN -> {
                "CAN incorect. Verificați codul CAN de 6 cifre de pe card."
            }
            is EIDReaderError.TagLost -> {
                "Conexiune pierdută cu cardul. Mențineți cardul aproape și încercați din nou."
            }
            is EIDReaderError.CardLocked -> {
                "Card blocat din cauza PIN-urilor incorecte. Contactați o autoritate de emitere."
            }
            is EIDReaderError.Timeout -> {
                "Timeout la citirea cardului. Încercați din nou."
            }
            is EIDReaderError.InvalidInput -> {
                error.message ?: "Date de intrare invalide."
            }
            else -> {
                "Eroare: ${error.message ?: "Eroare necunoscută"}"
            }
        }
    }

    /**
     * Get error code for SDK errors
     */
    private fun getErrorCode(error: Throwable): String {
        return when (error) {
            is EIDReaderError.InvalidPIN -> "INVALID_PIN"
            is EIDReaderError.InvalidCAN -> "INVALID_CAN"
            is EIDReaderError.TagLost -> "TAG_LOST"
            is EIDReaderError.CardLocked -> "CARD_LOCKED"
            is EIDReaderError.Timeout -> "TIMEOUT"
            is EIDReaderError.InvalidInput -> "INVALID_INPUT"
            else -> "UNKNOWN_ERROR"
        }
    }

    /**
     * Clean up resources when module is destroyed
     */
    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        readingJob?.cancel()
        moduleScope.cancel()
        NFCManager.stopWaitingForTag()
        NFCManager.clearTag()
    }
}
