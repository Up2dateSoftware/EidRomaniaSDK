# Romanian eID SDK

Professional iOS SDK for reading Romanian electronic identity documents (eID cards and ePassports) via NFC, with OCR and MRZ scanning capabilities.

## Features

### 🆔 ID Card Reading (NFC)
- Read Romanian electronic ID cards via NFC
- Extract personal data (name, CNP, address, dates)
- Retrieve facial photo from chip
- PACE authentication support
- CSCA certificate validation

### 🛂 Passport Reading (NFC + MRZ)
- Read Romanian ePassports via NFC with PACE/BAC
- **MRZ Scanner** - Camera-based Machine Readable Zone scanning
- Extract biometric data and photo
- Full ICAO 9303 compliance
- CSCA validation for document authenticity

### 📸 OCR Scanning
- OCR scanning for old non-NFC ID cards
- Multi-pass recognition with confidence scoring
- Extract CNP, name, address, dates
- Vision framework integration

### 🔒 Security & Licensing
- JWT-based licensing system
- Feature-based access control
- Secure data handling
- No debug logging in production

## Requirements

- iOS 17.6+
- Xcode 15.0+
- Swift 5.9+
- Physical device with NFC capability (for NFC features)
- Camera access (for OCR/MRZ scanning)

## Installation

### Manual Integration

1. Download the latest `RomanianEIDSDK.xcframework.zip` from [Releases](https://github.com/yourusername/RomanianEIDSDK/releases)
2. Unzip and drag `RomanianEIDSDK.xcframework` into your Xcode project
3. In your target's **General** tab, add the framework to **Frameworks, Libraries, and Embedded Content**
4. Set to **Embed & Sign**

### Required Permissions

Add these keys to your `Info.plist`:

```xml
<key>NFCReaderUsageDescription</key>
<string>We need NFC access to read your eID card or passport</string>
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan MRZ or perform OCR</string>
<key>com.apple.developer.nfc.readersession.iso7816.select-identifiers</key>
<array>
    <string>A0000002471001</string>
    <string>A0000002472001</string>
</array>
```

## Quick Start

### 1. Initialize SDK with License

```swift
import RomanianEIDSDK

// In AppDelegate or App struct
do {
    try await EIDReader.shared.initialize(licenseJWT: "your-license-jwt")
    print("SDK ready!")
} catch {
    print("License error: \(error)")
}
```

### 2. Read ID Card (NFC)

```swift
import RomanianEIDSDK

class IDCardViewController: UIViewController {
    func readIDCard() {
        Task {
            do {
                let result = try await EIDReader.shared.readIDCard(
                    from: self,
                    options: IDCardReadOptions(
                        enableCSCAValidation: true,
                        timeout: 60
                    )
                )

                print("Name: \(result.fullName)")
                print("CNP: \(result.cnp)")
                if let photo = result.facialImage {
                    imageView.image = photo
                }
            } catch {
                print("Read failed: \(error)")
            }
        }
    }
}
```

### 3. Read Passport with MRZ Scanner

```swift
func readPassport() {
    Task {
        do {
            // Step 1: Scan MRZ with camera
            let mrzResult = try await EIDReader.shared.startMRZScanning(from: self)

            print("MRZ Key: \(mrzResult.mrzKey)")
            print("Passport: \(mrzResult.documentNumber)")

            // Step 2: Read passport chip with NFC
            let passportResult = try await EIDReader.shared.readPassport(
                mrzKey: mrzResult.mrzKey,
                options: PassportReadOptions(
                    enableCSCAValidation: true,
                    timeout: 60
                )
            )

            print("Name: \(passportResult.fullName)")
            if let photo = passportResult.facialImage {
                imageView.image = photo
            }
        } catch {
            print("Error: \(error)")
        }
    }
}
```

### 4. OCR Scanning (Old ID Cards)

```swift
func scanOldIDCard() {
    Task {
        do {
            let result = try await EIDReader.shared.startOCRScanning(from: self)

            if result.isReliable {
                print("Name: \(result.fullName ?? "")")
                print("CNP: \(result.cnp ?? "")")
                print("Confidence: \(result.confidence * 100)%")
            }
        } catch {
            print("OCR failed: \(error)")
        }
    }
}
```

## API Reference

### EIDReader

Main SDK class (singleton):

```swift
public class EIDReader {
    static let shared: EIDReader

    // Initialization
    func initialize(licenseJWT: String) async throws
    var isReady: Bool { get }

    // ID Card Reading
    func readIDCard(from: UIViewController, options: IDCardReadOptions) async throws -> IDCardResult

    // Passport Reading
    func readPassport(mrzKey: String, options: PassportReadOptions) async throws -> PassportResult

    // MRZ Scanning
    func startMRZScanning(from: UIViewController) async throws -> MRZScanResult

    // OCR Scanning
    func startOCRScanning(from: UIViewController) async throws -> OCRScanResult
}
```

### Result Models

#### IDCardResult
```swift
public struct IDCardResult {
    let success: Bool
    let documentNumber: String
    let cnp: String
    let fullName: String
    let dateOfBirth: String
    let sex: String
    let dateOfExpiry: String
    let permanentAddress: String?
    let facialImage: UIImage?
    let cscaValidated: Bool
}
```

#### PassportResult
```swift
public struct PassportResult {
    let success: Bool
    let documentNumber: String
    let fullName: String
    let dateOfBirth: String
    let nationality: String
    let sex: String
    let dateOfExpiry: String
    let facialImage: UIImage?
    let cscaValidated: Bool
}
```

#### MRZScanResult
```swift
public struct MRZScanResult {
    let documentType: String
    let issuingCountry: String
    let documentNumber: String
    let surname: String
    let givenNames: String
    let nationality: String
    let sex: String
    let dateOfBirth: String
    let dateOfExpiry: String
    let mrzKey: String  // For BAC/PACE authentication
}
```

#### OCRScanResult
```swift
public struct OCRScanResult {
    let success: Bool
    let documentNumber: String?
    let cnp: String?
    let fullName: String?
    let dateOfBirth: String?
    let confidence: Float  // 0.0 - 1.0
    let isReliable: Bool   // true if confidence > 0.7
}
```

## Licensing

The SDK requires a valid JWT license. Features can be enabled/disabled per license:

- `idCardReading` - NFC ID card reading
- `passportReading` - NFC passport reading + MRZ scanner
- `ocrScanning` - OCR for old cards

Contact sales for licensing: [office@up2date.ro](mailto:office@up2date.ro)

## Demo Application

The `DemoApp` folder contains a complete example application demonstrating:
- ID Card reading with NFC
- Passport reading with MRZ scanner
- OCR scanning for old cards
- License initialization
- Error handling
- Result display

## Error Handling

```swift
do {
    let result = try await EIDReader.shared.readIDCard(from: self)
} catch EIDError.licenseInvalid {
    // Invalid or expired license
} catch EIDError.licenseExpired {
    // License has expired
} catch EIDError.featureNotLicensed(let feature) {
    // Feature not included in license
} catch EIDError.nfcNotAvailable {
    // Device doesn't support NFC
} catch EIDError.userCancelled {
    // User cancelled the operation
} catch EIDError.readFailed(let reason) {
    // Reading failed with reason
} catch {
    // Other errors
}
```

## System Requirements

### NFC Reading
- iPhone 7 or newer (iPhone XS or newer recommended for better NFC performance)
- iOS 17.6+

### OCR/MRZ Scanning
- Any device with camera
- Good lighting conditions recommended

## Version History

### Version 1.4.0
- ✅ Added MRZ scanner for passports
- ✅ Improved OCR accuracy
- ✅ Removed all debug logging
- ✅ Performance optimizations
- ✅ CSCA validation improvements

### Version 1.3.0
- Added OCR scanning for old ID cards
- Multi-pass OCR with confidence scoring
- Vision framework integration

### Version 1.2.0
- Added PACE support for Romanian passports
- CSCA validation
- Improved error handling

### Version 1.0.0
- Initial release
- ID card NFC reading
- Passport NFC reading

## Support

For technical support, questions, or feature requests:
- Email: [office@up2date.ro](mailto:office@up2date.ro)
- Documentation: [https://docs.up2date.ro/eid-sdk](https://docs.up2date.ro/eid-sdk)

## License

Copyright © 2025 Up2Date Software. All rights reserved.

This SDK is proprietary software. Usage requires a valid license.
