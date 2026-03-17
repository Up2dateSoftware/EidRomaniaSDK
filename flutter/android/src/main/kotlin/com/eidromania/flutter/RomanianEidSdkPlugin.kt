package com.eidromania.flutter

import android.app.Activity
import android.content.Context
import android.nfc.NfcAdapter
import androidx.annotation.NonNull
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.embedding.engine.plugins.activity.ActivityAware
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding
import io.flutter.plugin.common.EventChannel
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugin.common.MethodChannel.MethodCallHandler
import io.flutter.plugin.common.MethodChannel.Result

class RomanianEidSdkPlugin : FlutterPlugin, MethodCallHandler, ActivityAware, EventChannel.StreamHandler {
    private lateinit var channel: MethodChannel
    private lateinit var eventChannel: EventChannel
    private var eventSink: EventChannel.EventSink? = null
    private var context: Context? = null
    private var activity: Activity? = null
    private var nfcAdapter: NfcAdapter? = null

    // TODO: Import RomanianEIDSDK when available
    // private var eidReader: EIDReader? = null

    override fun onAttachedToEngine(@NonNull flutterPluginBinding: FlutterPlugin.FlutterPluginBinding) {
        context = flutterPluginBinding.applicationContext

        channel = MethodChannel(flutterPluginBinding.binaryMessenger, "romanian_eid_sdk")
        channel.setMethodCallHandler(this)

        eventChannel = EventChannel(flutterPluginBinding.binaryMessenger, "romanian_eid_sdk/progress")
        eventChannel.setStreamHandler(this)

        nfcAdapter = NfcAdapter.getDefaultAdapter(context)
    }

    override fun onMethodCall(@NonNull call: MethodCall, @NonNull result: Result) {
        when (call.method) {
            "initialize" -> handleInitialize(call, result)
            "isInitialized" -> handleIsInitialized(result)
            "isNfcAvailable" -> handleIsNfcAvailable(result)
            "readPassport" -> handleReadPassport(call, result)
            "readIDCard" -> handleReadIDCard(call, result)
            "scanMRZ" -> handleScanMRZ(result)
            "cancelReading" -> handleCancelReading(result)
            else -> result.notImplemented()
        }
    }

    // MARK: - Method Handlers

    private fun handleInitialize(call: MethodCall, result: Result) {
        val licenseKey = call.argument<String>("licenseKey")
        if (licenseKey == null) {
            result.error("INVALID_ARGUMENTS", "License key required", null)
            return
        }

        // TODO: Initialize with actual SDK
        // eidReader = EIDReader(context!!)
        // eidReader?.initialize(licenseKey) { success, error ->
        //     if (error != null) {
        //         result.error("INIT_ERROR", error.message, null)
        //     } else {
        //         result.success(success)
        //     }
        // }

        // Placeholder
        result.success(true)
    }

    private fun handleIsInitialized(result: Result) {
        // TODO: Check actual SDK initialization status
        // result.success(eidReader?.isInitialized ?: false)
        result.success(false)
    }

    private fun handleIsNfcAvailable(result: Result) {
        val available = nfcAdapter?.isEnabled ?: false
        result.success(available)
    }

    private fun handleReadPassport(call: MethodCall, result: Result) {
        val documentNumber = call.argument<String>("documentNumber")
        val dateOfBirth = call.argument<String>("dateOfBirth")
        val dateOfExpiry = call.argument<String>("dateOfExpiry")

        if (documentNumber == null || dateOfBirth == null || dateOfExpiry == null) {
            result.error("INVALID_ARGUMENTS", "Document number, date of birth, and date of expiry required", null)
            return
        }

        // TODO: Implement actual passport reading
        // eidReader?.readPassport(
        //     documentNumber = documentNumber,
        //     dateOfBirth = dateOfBirth,
        //     dateOfExpiry = dateOfExpiry,
        //     progressHandler = { progress ->
        //         sendProgress(progress)
        //     },
        //     completionHandler = { passportData, error ->
        //         if (error != null) {
        //             result.error("READ_ERROR", error.message, null)
        //         } else {
        //             result.success(passportDataToMap(passportData))
        //         }
        //     }
        // )

        result.error("NOT_IMPLEMENTED", "SDK not integrated yet", null)
    }

    private fun handleReadIDCard(call: MethodCall, result: Result) {
        val can = call.argument<String>("can")

        if (can == null) {
            result.error("INVALID_ARGUMENTS", "CAN required", null)
            return
        }

        // TODO: Implement actual ID card reading
        // eidReader?.readIDCard(
        //     can = can,
        //     progressHandler = { progress ->
        //         sendProgress(progress)
        //     },
        //     completionHandler = { idCardData, error ->
        //         if (error != null) {
        //             result.error("READ_ERROR", error.message, null)
        //         } else {
        //             result.success(idCardDataToMap(idCardData))
        //         }
        //     }
        // )

        result.error("NOT_IMPLEMENTED", "SDK not integrated yet", null)
    }

    private fun handleScanMRZ(result: Result) {
        // TODO: Implement MRZ scanning
        result.error("NOT_IMPLEMENTED", "MRZ scanning not implemented yet", null)
    }

    private fun handleCancelReading(result: Result) {
        // TODO: Cancel ongoing reading
        // eidReader?.cancelReading()
        result.success(null)
    }

    // MARK: - Helper Methods

    private fun sendProgress(progress: Map<String, Any>) {
        activity?.runOnUiThread {
            eventSink?.success(progress)
        }
    }

    // MARK: - FlutterPlugin Lifecycle

    override fun onDetachedFromEngine(@NonNull binding: FlutterPlugin.FlutterPluginBinding) {
        channel.setMethodCallHandler(null)
        eventChannel.setStreamHandler(null)
    }

    // MARK: - ActivityAware

    override fun onAttachedToActivity(binding: ActivityPluginBinding) {
        activity = binding.activity
    }

    override fun onDetachedFromActivityForConfigChanges() {
        activity = null
    }

    override fun onReattachedToActivityForConfigChanges(binding: ActivityPluginBinding) {
        activity = binding.activity
    }

    override fun onDetachedFromActivity() {
        activity = null
    }

    // MARK: - EventChannel.StreamHandler

    override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
        eventSink = events
    }

    override fun onCancel(arguments: Any?) {
        eventSink = null
    }
}
