package com.rnromanianeidsdk

import android.app.Activity
import android.app.Application
import android.app.PendingIntent
import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.os.Bundle
import android.util.Log
import com.up2date.eidromania.eidromaniasdk.NFCManager

/**
 * Automatically manages NFC lifecycle for all activities in the app.
 * This eliminates the need for manual NFC setup in MainActivity.
 */
class NFCLifecycleManager : Application.ActivityLifecycleCallbacks {

    companion object {
        private const val TAG = "NFCLifecycleManager"

        @Volatile
        private var instance: NFCLifecycleManager? = null

        /**
         * Registers this manager with the application to automatically handle NFC.
         * Call this once during app initialization.
         * This method is idempotent - it will only register once.
         */
        @JvmStatic
        fun register(application: Application) {
            if (instance == null) {
                synchronized(this) {
                    if (instance == null) {
                        val manager = NFCLifecycleManager()
                        application.registerActivityLifecycleCallbacks(manager)
                        instance = manager
                        Log.d(TAG, "NFC lifecycle manager registered")
                    } else {
                        Log.d(TAG, "NFC lifecycle manager already registered, skipping")
                    }
                }
            } else {
                Log.d(TAG, "NFC lifecycle manager already registered, skipping")
            }
        }
    }

    private var currentActivity: Activity? = null
    private var nfcAdapter: NfcAdapter? = null
    private var pendingIntent: PendingIntent? = null

    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
        Log.d(TAG, "Activity created: ${activity.javaClass.simpleName}")
        currentActivity = activity

        // Initialize NFC adapter
        nfcAdapter = NfcAdapter.getDefaultAdapter(activity)

        if (nfcAdapter == null) {
            Log.w(TAG, "NFC not available on this device")
            return
        }

        // Create pending intent for foreground dispatch
        pendingIntent = PendingIntent.getActivity(
            activity,
            0,
            Intent(activity, activity.javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
            PendingIntent.FLAG_MUTABLE
        )

        // Handle NFC intent if activity was launched via NFC
        handleNfcIntent(activity.intent)
    }

    override fun onActivityStarted(activity: Activity) {
        currentActivity = activity
    }

    override fun onActivityResumed(activity: Activity) {
        Log.d(TAG, "Activity resumed: ${activity.javaClass.simpleName}")
        currentActivity = activity

        // Enable foreground dispatch to intercept NFC intents
        nfcAdapter?.enableForegroundDispatch(activity, pendingIntent, null, null)
        Log.d(TAG, "NFC foreground dispatch enabled")
    }

    override fun onActivityPaused(activity: Activity) {
        Log.d(TAG, "Activity paused: ${activity.javaClass.simpleName}")

        // Disable foreground dispatch
        nfcAdapter?.disableForegroundDispatch(activity)
        Log.d(TAG, "NFC foreground dispatch disabled")
    }

    override fun onActivityStopped(activity: Activity) {
        if (currentActivity == activity) {
            currentActivity = null
        }
    }

    override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {
        // No action needed
    }

    override fun onActivityDestroyed(activity: Activity) {
        if (currentActivity == activity) {
            currentActivity = null
        }
    }

    /**
     * Handles NFC intents and extracts the tag.
     * Called when activity receives a new NFC intent.
     */
    private fun handleNfcIntent(intent: Intent?) {
        if (intent == null) return

        val action = intent.action
        Log.d(TAG, "Handling intent with action: $action")

        if (action == NfcAdapter.ACTION_TECH_DISCOVERED ||
            action == NfcAdapter.ACTION_TAG_DISCOVERED ||
            action == NfcAdapter.ACTION_NDEF_DISCOVERED) {

            val tag: Tag? = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                intent.getParcelableExtra(NfcAdapter.EXTRA_TAG, Tag::class.java)
            } else {
                @Suppress("DEPRECATION")
                intent.getParcelableExtra(NfcAdapter.EXTRA_TAG)
            }

            if (tag != null) {
                Log.d(TAG, "NFC tag detected: ${tag.id.joinToString(":") { "%02x".format(it) }}")
                NFCManager.setTag(tag)
            } else {
                Log.w(TAG, "NFC intent received but no tag found")
            }
        }
    }

    /**
     * Call this from Activity.onNewIntent() to handle new NFC intents.
     * This is automatically handled if you don't override onNewIntent in your activity.
     */
    fun handleNewIntent(intent: Intent?) {
        handleNfcIntent(intent)
    }
}
