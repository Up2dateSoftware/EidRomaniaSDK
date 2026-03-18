package com.rnromanianeidsdk;

import android.app.Application;
import android.util.Log;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class RNRomanianEIDSDKPackage implements ReactPackage {
    private static final String TAG = "RNRomanianEIDSDKPackage";

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        // Register NFC lifecycle manager when package is loaded (early in app startup)
        try {
            Application application = (Application) reactContext.getApplicationContext();
            NFCLifecycleManager.register(application);
            Log.d(TAG, "NFC lifecycle manager registered from package");
        } catch (Exception e) {
            Log.e(TAG, "Failed to register NFC lifecycle manager from package", e);
        }

        return Arrays.<NativeModule>asList(new RNRomanianEIDSDKModule(reactContext));
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
