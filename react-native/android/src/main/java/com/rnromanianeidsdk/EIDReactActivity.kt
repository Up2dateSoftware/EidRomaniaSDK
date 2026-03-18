package com.rnromanianeidsdk

import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.util.Log
import com.facebook.react.ReactActivity
import com.up2date.eidromania.eidromaniasdk.NFCManager

/**
 * Optional base ReactActivity that automatically handles NFC intents.
 *
 * Users can extend this activity instead of ReactActivity to get automatic
 * NFC handling without any additional setup.
 *
 * Example:
 * ```kotlin
 * class MainActivity : EIDReactActivity() {
 *     override fun getMainComponentName(): String = "MyApp"
 * }
 * ```
 *
 * Note: This is optional. The NFCLifecycleManager will handle most NFC cases
 * automatically. This class is only needed if you want to ensure onNewIntent
 * is properly handled in all edge cases.
 */
abstract class EIDReactActivity : ReactActivity() {

    companion object {
        private const val TAG = "EIDReactActivity"
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleNfcIntent(intent)
    }

    private fun handleNfcIntent(intent: Intent?) {
        if (intent == null) return

        val action = intent.action
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
                Log.d(TAG, "NFC tag detected via onNewIntent")
                NFCManager.setTag(tag)
            }
        }
    }
}
