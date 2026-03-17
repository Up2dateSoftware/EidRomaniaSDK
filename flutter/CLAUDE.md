# Romanian eID SDK for Flutter

## Project Overview
Flutter plugin wrapper for the Romanian Electronic Identity Document SDK. Provides Dart bindings for iOS and Android native SDKs using platform channels.

## Architecture

```
eidromania-flutter/
├── lib/
│   ├── romanian_eid_sdk.dart     # Library exports
│   └── src/
│       ├── romanian_eid_sdk.dart # Main SDK class with MethodChannel
│       └── models.dart           # Data classes
├── ios/
│   ├── romanian_eid_sdk.podspec
│   └── Classes/
│       └── RomanianEidSdkPlugin.swift
├── android/
│   ├── build.gradle
│   └── src/main/
│       ├── AndroidManifest.xml
│       └── kotlin/com/eidromania/flutter/
│           └── RomanianEidSdkPlugin.kt
└── example/                       # Demo app
```

## Platform Channels

### MethodChannel: `romanian_eid_sdk`
- `initialize(licenseKey: String)` → `bool`
- `isInitialized()` → `bool`
- `isNfcAvailable()` → `bool`
- `readPassport(documentNumber, dateOfBirth, dateOfExpiry)` → `Map`
- `readIDCard(can)` → `Map`
- `scanMRZ()` → `Map?`
- `cancelReading()` → `void`

### EventChannel: `romanian_eid_sdk/progress`
- Streams `ReadingProgress` events during document reading

## Development

### Prerequisites
- Flutter 3.10+
- iOS: Xcode 15+, CocoaPods
- Android: Android Studio, NDK

### Build & Run
```bash
# Get dependencies
flutter pub get

# Run example (iOS)
cd example && flutter run -d ios

# Run example (Android)
cd example && flutter run -d android
```

## Native SDK Integration

### iOS
The iOS SDK should be added via CocoaPods. Update `ios/romanian_eid_sdk.podspec`:
```ruby
s.dependency 'RomanianEIDSDK', '~> 1.4.17'
# Or use vendored framework:
s.vendored_frameworks = 'Frameworks/RomanianEIDSDK.xcframework'
```

### Android
The Android SDK should be added via Gradle. Update `android/build.gradle`:
```gradle
dependencies {
    implementation 'com.eidromania:android-sdk:1.0.0'
}
```

## TODO
- [ ] Integrate actual iOS SDK (RomanianEIDSDK.xcframework)
- [ ] Implement Android SDK
- [ ] Complete MRZ scanning functionality
- [ ] Add face image and signature extraction

## Related Repositories
- iOS SDK: `eidromania-ios-sdk`
- Android SDK: (to be created)
- React Native SDK: `eidromania-reactnative`
- Windows SDK: `eidromania-windows`
- Main iOS App: `eidromania`
