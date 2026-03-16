# Integration Guide - Romanian eID SDK

Step-by-step guide for integrating the Romanian eID SDK into your iOS application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [License Setup](#license-setup)
5. [Implementation Examples](#implementation-examples)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Development Environment
- macOS 14.0 or later
- Xcode 15.0 or later
- iOS 17.6+ deployment target
- Valid Apple Developer account (for NFC entitlements)

### Hardware Requirements
- Physical iOS device with NFC (iPhone 7 or later)
- Camera-enabled device (for OCR/MRZ features)

### Knowledge Requirements
- Basic Swift/SwiftUI or UIKit knowledge
- Understanding of async/await patterns
- Familiarity with iOS permissions

## Installation

### Step 1: Download SDK

Download `RomanianEIDSDK.xcframework` from the [latest release](https://github.com/yourusername/RomanianEIDSDK/releases).

### Step 2: Add to Project

1. Drag `RomanianEIDSDK.xcframework` into your Xcode project
2. Check "Copy items if needed"
3. Add to your app target

### Step 3: Embed Framework

1. Select your project in Xcode
2. Select your app target
3. Go to **General** tab
4. In **Frameworks, Libraries, and Embedded Content**:
   - Find `RomanianEIDSDK.xcframework`
   - Set to **Embed & Sign**

## Configuration

### Step 1: Enable NFC Capability

1. Select your target → **Signing & Capabilities**
2. Click **+ Capability**
3. Add **Near Field Communication Tag Reading**

### Step 2: Configure Info.plist

Add these keys to your `Info.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- NFC Permission -->
    <key>NFCReaderUsageDescription</key>
    <string>We need NFC access to read your electronic ID card or passport</string>

    <!-- Camera Permission (for OCR/MRZ) -->
    <key>NSCameraUsageDescription</key>
    <string>We need camera access to scan your document</string>

    <!-- NFC ISO7816 Application Identifiers -->
    <key>com.apple.developer.nfc.readersession.iso7816.select-identifiers</key>
    <array>
        <string>A0000002471001</string>  <!-- ePassport -->
        <string>A0000002472001</string>  <!-- eID Card -->
    </array>
</dict>
</plist>
```

### Step 3: Add Entitlements

Create or edit `YourApp.entitlements`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.nfc.readersession.formats</key>
    <array>
        <string>TAG</string>
    </array>
</dict>
</plist>
```

## License Setup

### Step 1: Obtain License

Contact [office@up2date.ro](mailto:office@up2date.ro) to obtain your JWT license.

### Step 2: Add License to Project

Option A: Add license file to project
```swift
// Add demo_license.jwt to your project
guard let licenseURL = Bundle.main.url(forResource: "demo_license", withExtension: "jwt"),
      let licenseJWT = try? String(contentsOf: licenseURL) else {
    fatalError("License file not found")
}
```

Option B: Hardcode license (for testing only)
```swift
let licenseJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 3: Initialize SDK

In your `App.swift` or `AppDelegate.swift`:

```swift
import SwiftUI
import RomanianEIDSDK

@main
struct YourApp: App {
    init() {
        initializeSDK()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }

    private func initializeSDK() {
        Task {
            do {
                guard let licenseURL = Bundle.main.url(forResource: "demo_license", withExtension: "jwt"),
                      let licenseJWT = try? String(contentsOf: licenseURL) else {
                    print("❌ License file not found")
                    return
                }

                try await EIDReader.shared.initialize(licenseJWT: licenseJWT)
                print("✅ SDK initialized successfully")
            } catch {
                print("❌ SDK initialization failed: \(error)")
            }
        }
    }
}
```

## Implementation Examples

### Example 1: Simple ID Card Reader

```swift
import SwiftUI
import RomanianEIDSDK

struct IDCardReaderView: View {
    @State private var result: IDCardResult?
    @State private var errorMessage: String?
    @State private var isReading = false

    var body: some View {
        VStack(spacing: 20) {
            if let result = result {
                // Show results
                VStack(alignment: .leading) {
                    Text("Name: \(result.fullName)")
                    Text("CNP: \(result.cnp)")
                    Text("Document: \(result.documentNumber)")

                    if let photo = result.facialImage {
                        Image(uiImage: photo)
                            .resizable()
                            .scaledToFit()
                            .frame(height: 200)
                    }
                }
            }

            Button("Read ID Card") {
                readIDCard()
            }
            .disabled(isReading)

            if let error = errorMessage {
                Text(error)
                    .foregroundColor(.red)
            }
        }
        .padding()
    }

    private func readIDCard() {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootVC = windowScene.windows.first?.rootViewController else {
            return
        }

        isReading = true
        errorMessage = nil

        Task {
            do {
                let idResult = try await EIDReader.shared.readIDCard(
                    from: rootVC,
                    options: IDCardReadOptions(
                        enableCSCAValidation: true,
                        timeout: 60
                    )
                )

                await MainActor.run {
                    result = idResult
                    isReading = false
                }
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                    isReading = false
                }
            }
        }
    }
}
```

### Example 2: Passport Reader with MRZ Scanner

```swift
import SwiftUI
import RomanianEIDSDK

struct PassportReaderView: View {
    @State private var mrzResult: MRZScanResult?
    @State private var passportResult: PassportResult?
    @State private var errorMessage: String?
    @State private var isScanning = false

    var body: some View {
        VStack(spacing: 20) {
            // Step 1: Scan MRZ
            if mrzResult == nil {
                Button("Scan MRZ") {
                    scanMRZ()
                }
                .disabled(isScanning)
            }

            // Step 2: Show MRZ result
            if let mrz = mrzResult, passportResult == nil {
                VStack(alignment: .leading) {
                    Text("MRZ Scanned:")
                    Text("Passport: \(mrz.documentNumber)")
                    Text("Name: \(mrz.givenNames) \(mrz.surname)")

                    Button("Read Passport via NFC") {
                        readPassport(mrzKey: mrz.mrzKey)
                    }
                }
            }

            // Step 3: Show final result
            if let passport = passportResult {
                VStack(alignment: .leading) {
                    Text("✅ Passport Read Successfully")
                    Text("Name: \(passport.fullName)")
                    Text("DOB: \(passport.dateOfBirth)")

                    if let photo = passport.facialImage {
                        Image(uiImage: photo)
                            .resizable()
                            .scaledToFit()
                            .frame(height: 200)
                    }
                }
            }

            if let error = errorMessage {
                Text(error)
                    .foregroundColor(.red)
            }
        }
        .padding()
    }

    private func scanMRZ() {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootVC = windowScene.windows.first?.rootViewController else {
            return
        }

        isScanning = true
        Task {
            do {
                let mrz = try await EIDReader.shared.startMRZScanning(from: rootVC)
                await MainActor.run {
                    mrzResult = mrz
                    isScanning = false
                }
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                    isScanning = false
                }
            }
        }
    }

    private func readPassport(mrzKey: String) {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootVC = windowScene.windows.first?.rootViewController else {
            return
        }

        Task {
            do {
                let passport = try await EIDReader.shared.readPassport(
                    mrzKey: mrzKey,
                    options: PassportReadOptions(
                        enableCSCAValidation: true,
                        timeout: 60
                    )
                )

                await MainActor.run {
                    passportResult = passport
                }
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                }
            }
        }
    }
}
```

### Example 3: OCR Scanner for Old Cards

```swift
import SwiftUI
import RomanianEIDSDK

struct OCRScannerView: View {
    @State private var result: OCRScanResult?
    @State private var errorMessage: String?

    var body: some View {
        VStack(spacing: 20) {
            Button("Scan Old ID Card (OCR)") {
                scanOCR()
            }

            if let result = result {
                if result.isReliable {
                    VStack(alignment: .leading) {
                        Text("✅ OCR Scan Successful")
                        Text("Confidence: \(Int(result.confidence * 100))%")

                        if let name = result.fullName {
                            Text("Name: \(name)")
                        }
                        if let cnp = result.cnp {
                            Text("CNP: \(cnp)")
                        }
                    }
                } else {
                    Text("⚠️ Low confidence. Please try again in better lighting.")
                        .foregroundColor(.orange)
                }
            }

            if let error = errorMessage {
                Text(error)
                    .foregroundColor(.red)
            }
        }
        .padding()
    }

    private func scanOCR() {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootVC = windowScene.windows.first?.rootViewController else {
            return
        }

        Task {
            do {
                let ocrResult = try await EIDReader.shared.startOCRScanning(from: rootVC)

                await MainActor.run {
                    result = ocrResult
                }
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                }
            }
        }
    }
}
```

## Testing

### Test on Real Device

1. **Build and run on physical device** (NFC doesn't work in Simulator)
2. **Prepare test documents:**
   - Romanian eID card (new format with chip)
   - Romanian ePassport
   - Old ID card (for OCR testing)

### Test Checklist

- [ ] SDK initialization succeeds
- [ ] License validation works
- [ ] ID card NFC reading works
- [ ] Passport MRZ scanning works
- [ ] Passport NFC reading works
- [ ] OCR scanning works for old cards
- [ ] Photos are extracted correctly
- [ ] Error handling works (cancel, timeout, etc.)
- [ ] UI doesn't freeze during operations

## Troubleshooting

### Common Issues

#### "License Invalid" Error
```
Solution: Check that your license JWT is correct and not expired.
Contact support for a new license.
```

#### "NFC Not Available" Error
```
Solution: Ensure you're testing on a physical device (iPhone 7+).
Check that NFC capability is enabled in Xcode.
```

#### "Feature Not Licensed" Error
```
Solution: Your license doesn't include this feature.
Contact sales to upgrade your license.
```

#### NFC Session Fails to Start
```
Solution:
1. Check Info.plist has NFCReaderUsageDescription
2. Check entitlements file has nfc.readersession.formats
3. Restart device
4. Clean build folder (Cmd+Shift+K)
```

#### Camera Not Opening for MRZ/OCR
```
Solution:
1. Check Info.plist has NSCameraUsageDescription
2. Grant camera permission in Settings
3. Test on real device, not simulator
```

### Debug Logging

The SDK has no debug logging in production. For development support:

```swift
// Check SDK readiness
if EIDReader.shared.isReady {
    print("SDK is ready")
} else {
    print("SDK not initialized")
}

// Check license info
if let info = EIDLicenseManager.shared.licenseInfo {
    print("License company: \(info.company)")
    print("License tier: \(info.tier)")
    print("Expires: \(info.expiresAt)")
}
```

## Next Steps

1. Review the [Demo Application](../DemoApp) for complete examples
2. Check [API Reference](API_REFERENCE.md) for detailed documentation
3. Read [Best Practices](BEST_PRACTICES.md) for production deployment
4. Contact support for production licenses

## Support

- **Email:** office@up2date.ro
- **Documentation:** https://docs.up2date.ro/eid-sdk
- **Issues:** Report bugs via email or GitHub issues
