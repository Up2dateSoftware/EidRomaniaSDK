# Romanian eID SDK – iOS

Modern Swift SDK for reading and signing with Romanian electronic identity
documents (ePassports and eID cards) via NFC.

## Features

- **Passport reading** – BAC/PACE, DG1/DG2/DG7/DG11/DG12/SOD
- **eID card reading** – PACE with CAN + PIN, full personal data + addresses
- **Document signing** – ECDSA P-384 / SHA-384 on the on-card eSign sub-application
  (Romanian CEI / IDEMIA profile). Returns the raw signature + DER signer certificate
  so the caller can wrap it into CMS / PAdES / CAdES.
- **MRZ camera scanning** – Vision-based OCR for passport MRZ
- **OCR for legacy ID cards** – Camera flow or direct `UIImage`
- **CSCA validation** – Document signer chain against the bundled CSCA master list
- **Biometric extraction** – Photo + signature from the chip
- **Runtime language switching** – `EIDLocalization.setLanguage("ro" | "en" | nil)`
- **Keychain persistence** – save / load / delete results securely
- **JWS license** – offline, signed token validation

## Requirements

- iOS **15.0+**
- Xcode 15+ / Swift 5.9+
- iPhone 7 or later (for NFC)
- Valid SDK license (`office@up2date.ro`)

## Installation

### Swift Package Manager (recommended)

```
https://github.com/Up2dateSoftware/EidRomaniaSDK.git
```

```swift
.package(url: "https://github.com/Up2dateSoftware/EidRomaniaSDK.git", exact: "1.4.23")
```

### Manual XCFramework

1. Download `RomanianEIDSDK.xcframework.zip` from the latest [Release](https://github.com/Up2dateSoftware/EidRomaniaSDK/releases)
2. Drag `RomanianEIDSDK.xcframework` into your target
3. Set it to **Embed & Sign**

### Info.plist & entitlements

```xml
<key>NFCReaderUsageDescription</key>
<string>We need NFC to read your electronic ID document</string>

<key>NSCameraUsageDescription</key>
<string>We need camera access to scan MRZ codes or photograph ID cards</string>
```

```xml
<key>com.apple.developer.nfc.readersession.iso7816.select-identifiers</key>
<array>
    <string>A0000002471001</string>                   <!-- ePassport MRTD -->
    <string>A000000077030C60000000FE00000500</string> <!-- Romanian National Application -->
    <string>E828BD080FA000000167454441544100</string> <!-- Romanian eDATA Application -->
    <string>A000000077010800070000FE00000100</string> <!-- CEN DF.eSign (signing) -->
</array>
```

These identifiers are also exposed as `EIDReader.requiredISO7816Identifiers`.

## Quick start

### 1 · Initialize the license

```swift
import RomanianEIDSDK

try EIDLicenseManager.shared.initialize(licenseKey: "<your-JWS-token>")
guard EIDReader.shared.isReady else { return }
```

### 2 · Read a passport

```swift
let passport = try await EIDReader.shared.readPassport(
    mrzKey: "RO1234567<0850315301231",
    options: PassportReadOptions(enableCSCAValidation: true, timeout: 60)
)
print(passport.fullName, passport.documentNumber, passport.cnp ?? "-")
```

### 3 · Read an eID card

```swift
let card = try await EIDReader.shared.readIDCard(
    can: "123456",
    pin: "1234",                       // data PIN (4–8 digits)
    options: IDCardReadOptions(
        enableCSCAValidation: true,
        readPhoto: true,
        readSignature: true,
        timeout: 90
    )
)
print(card.cnp, card.permanentAddress ?? "-", card.issuingAuthority ?? "-")
```

> 1.4.x change · `readIDCard` requires the data PIN as a parameter.

### 4 · Sign a hash with the card's eSign sub-application

```swift
let digest = SHA384.hash(data: pdfBytes)            // 48-byte SHA-384
let hash = Data(digest)

let result = try await EIDReader.shared.signHash(
    hash: hash,
    can: "123456",
    signingPIN: "123456",               // signing PIN (separate from the data PIN)
    options: SigningOptions(hashAlgorithm: .sha384, timeout: 60)
)

let rawSignature = result.signature      // raw r||s from the card (96 B for P-384)
let signerCertDER = result.certificate   // DER-encoded X.509 signing certificate
```

Wrap `result` into CMS / PAdES / CAdES on the device or send it to a
backend. The example app ships a full PAdES B-B inline implementation
with a CAdES-detached `.p7s` sidecar.

### 5 · MRZ + OCR camera flows

```swift
let mrz = try await EIDReader.shared.startMRZScanning(from: self)
// feed mrz.mrzKey straight into readPassport(...)

let ocr = try await EIDReader.shared.startOCRScanning(from: self)
// or, from an existing UIImage:
let ocr2 = try await EIDReader.shared.scanIDCard(image: somePhoto)
```

### 6 · Runtime language switching

```swift
EIDLocalization.setLanguage("ro")
EIDLocalization.setLanguage("en")
EIDLocalization.setLanguage(nil)        // follow iOS Settings

NotificationCenter.default.addObserver(
    forName: EIDLocalization.languageDidChangeNotification,
    object: nil,
    queue: .main
) { _ in /* refresh UI */ }
```

NFC alert messages, progress callbacks and `EIDError.localizedDescription`
all follow the override immediately – no app restart required.

### 7 · Secure persistence (Keychain)

```swift
try EIDReader.shared.saveIDCard(card)
let restored = try EIDReader.shared.loadIDCard()
try EIDReader.shared.deleteIDCard()

try EIDReader.shared.savePassport(passport)
let restoredPP = try EIDReader.shared.loadPassport()
try EIDReader.shared.deletePassport()
```

Encrypted with AES-256-GCM; images base64-encoded.

## Public API surface

```swift
EIDReader.shared
    .readPassport(mrzKey:, options:, delegate:) async throws -> PassportResult
    .readIDCard(can:, pin:, options:, delegate:) async throws -> IDCardResult
    .signHash(hash:, can:, signingPIN:, options:, delegate:) async throws
        -> CardSignatureResult
    .startMRZScanning(from:, delegate:) async throws -> MRZScanResult
    .startOCRScanning(from:, delegate:) async throws -> OCRScanResult
    .scanIDCard(image:) async throws -> OCRScanResult
    .saveIDCard / loadIDCard / deleteIDCard
    .savePassport / loadPassport / deletePassport
```

```swift
EIDLocalization.setLanguage(_:)
EIDLocalization.currentLanguage / availableLanguages
EIDLocalization.languageDidChangeNotification
EIDLocalization.localizedString(forKey:)

EIDLicenseManager.shared
    .initialize(licenseKey:)
    .validateLicense()
    .hasFeature(_:)
    .licenseInfo

enum LicenseFeature {
    case passportReading, idCardReading, ocrScanning,
         cscaValidation, biometricExtraction,
         advancedSecurity, documentSigning
}
```

### Result models

| Type | Highlights |
|---|---|
| `PassportResult` | `documentNumber`, `fullName`, `dateOfBirth`, `nationality`, `issuingCountry`, `sex`, `dateOfExpiry`, `cnp?`, `placeOfBirth?`, `residenceAddress?`, `phoneNumber?`, `facialImage?`, `signatureImage?`, CSCA fields |
| `IDCardResult`  | `documentNumber`, `cnp`, `fullName`, `dateOfBirth`, `sex`, `dateOfIssue?`, `dateOfExpiry`, `issuingAuthority?`, `placeOfBirth?`, `citizenship?`, `permanentAddress?`, `temporaryAddress?`, `foreignAddress?`, `facialImage?`, `signatureImage?` |
| `MRZScanResult` | Structured TD3 fields + `mrzKey` |
| `OCRScanResult` | Text + per-field confidence + `isReliable` + `validationIssues` |
| `CardSignatureResult` | `signature: Data`, `certificate: Data`, `hashAlgorithm: SigningHashAlgorithm` |

All result types support `toJSON()` / `toJSONString()`.

### Errors – `EIDError`

```swift
case licenseInvalid, licenseExpired, bundleIdMismatch, featureNotLicensed(_)
case nfcNotAvailable, nfcSessionFailed(_), invalidMRZ, invalidCAN, invalidPIN,
     invalidTag, readTimeout, connectionLost, userCancelled
case cscaValidationFailed(_), signatureInvalid
case signingPINIncorrect(remainingAttempts:), signingPINBlocked,
     signingAppletNotFound, signingFailed(_),
     signingCertificateUnavailable(_), invalidHashLength
case readFailed(_), unexpectedError(_)
```

`EIDError.localizedDescription` is fully localized via the bundled
`Localizable.strings` (en + ro) and reacts to `EIDLocalization.setLanguage`.

## MRZ key & CAN reference

```
MRZ key  =  DocumentNumber<CD || DOB(YYMMDD)<CD || Expiry(YYMMDD)<CD
Example  =  RO1234567<0850315301231
```

CAN is the 6-digit number printed on the front of the eID card. The data
PIN protects personal data reading; the signing PIN protects the qualified
signing key (often different from the data PIN).

## Best practices

- **Initialize the license once** at app launch.
- **Handle `EIDError.signingPINIncorrect`** carefully – the card locks
  the signing key after 5 wrong attempts. The SDK probes the slot before
  verifying, so a typo on your side won't burn an attempt, but a wrong
  user input still does.
- **Adjust `timeout`** when running with a metallic case or poor antenna.
- **Use `EIDLocalization.languageDidChangeNotification`** to refresh any
  cached SDK strings in your UI when the user toggles language.

## Demo app

`DemoApp/` ships a full SwiftUI sample that exercises every public
surface: passport read, ID card read, MRZ scan, OCR, language picker,
Keychain persistence, and a PAdES B-B / CAdES-detached signing flow with
PDF picker and on-page placement.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `nfcNotAvailable` | iOS simulator, or NFC entitlement / Info.plist key missing |
| `invalidMRZ` | Wrong check digits in `mrzKey` |
| `invalidCAN` | CAN must be 6 digits |
| `invalidPIN` | Data PIN: 4–8 digits |
| `signingAppletNotFound` | Card lacks the eSign sub-application or applet AID mismatch |
| `signingPINBlocked` | 5 wrong signing PIN attempts; user must unblock via PUK |
| `cscaValidationFailed` | Document signer chain doesn't match the bundled CSCA list |
| `connectionLost` | Card moved during reading – keep it still |

## License

Commercial. Contact `office@up2date.ro` for licensing.

Copyright © 2025-2026 Up2Date Software SRL. All rights reserved.
