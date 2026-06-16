# Romanian eID SDK

Professional SDK for reading Romanian electronic identity documents (ePassports and ID cards) via NFC technology.

[![License](https://img.shields.io/badge/license-Commercial-blue.svg)](LICENSE.md)
[![iOS](https://img.shields.io/badge/iOS-14.0%2B-blue.svg)](https://developer.apple.com/ios/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76%2B-blue.svg)](https://reactnative.dev/)
[![Flutter](https://img.shields.io/badge/Flutter-3.10%2B-blue.svg)](https://flutter.dev/)

## 🌟 Features

✅ **NFC Passport Reading** - Read Romanian ePassports using BAC/PACE protocols
✅ **NFC ID Card Reading** - Read Romanian electronic ID cards using PACE
✅ **MRZ Scanning** - Camera-based Machine Readable Zone scanning
✅ **OCR Scanning** - Extract data from old non-NFC ID cards
✅ **CSCA Validation** - Validate document authenticity with CSCA certificates
✅ **Biometric Extraction** - Extract photos and signatures from documents
✅ **ICAO 9303 Compliant** - Full compliance with international standards
✅ **License Management** - Secure JWT-based license system
✅ **TypeScript Support** - Full TypeScript definitions included

## 📦 Repository Structure

```
EidRomaniaSDK/
├── ios/                          # Native iOS SDK
│   ├── Framework/                # XCFramework (pre-compiled binary)
│   ├── DemoApp/                  # Native iOS example app
│   ├── Documentation/            # Integration guides
│   └── README.md                 # iOS documentation
├── react-native/                 # React Native package (iOS + Android)
│   ├── ios/                      # iOS native bridge + XCFramework
│   ├── android/                  # Android native bridge
│   ├── src/                      # TypeScript source
│   ├── example/                  # Complete React Native demo app
│   └── README.md                 # React Native documentation
├── flutter/                      # Flutter plugin (iOS + Android)
│   ├── ios/                      # iOS native plugin
│   ├── android/                  # Android native plugin
│   ├── lib/                      # Dart source
│   ├── example/                  # Complete Flutter demo app
│   └── README.md                 # Flutter documentation
├── Package.swift                 # Swift Package Manager manifest
├── RomanianEIDSDK.podspec        # CocoaPods spec for iOS
└── README.md                     # This file
```

## 🚀 Quick Start

### Flutter Integration

```bash
# Add to your pubspec.yaml
dependencies:
  romanian_eid_sdk:
    git:
      url: https://github.com/Up2dateSoftware/EidRomaniaSDK.git
      path: flutter

# Or clone and try the example app
git clone https://github.com/Up2dateSoftware/EidRomaniaSDK.git
cd EidRomaniaSDK/flutter/example
flutter pub get
flutter run
```

**Complete guide**: See [flutter/README.md](flutter/README.md)

### React Native Integration

```bash
# Clone or download this repository
git clone https://github.com/Up2dateSoftware/EidRomaniaSDK.git
cd EidRomaniaSDK

# Try the React Native example app
cd react-native/example
npm install
cd ios && pod install && cd ..
npm run ios
```

**Complete guide**: See [react-native/README.md](react-native/README.md)

### Native iOS Integration

#### Method 1: Swift Package Manager (Recommended)

In Xcode: **File → Add Package Dependencies** and enter:
```
https://github.com/Up2dateSoftware/EidRomaniaSDK.git
```

Or add to your `Package.swift`:
```swift
dependencies: [
    .package(url: "https://github.com/Up2dateSoftware/EidRomaniaSDK.git", exact: "1.4.23")
]
```

#### Method 2: CocoaPods

Add to your `Podfile`:

```ruby
pod 'RomanianEIDSDK', :git => 'https://github.com/Up2dateSoftware/EidRomaniaSDK.git'
```

Then run:
```bash
pod install
```

#### Method 3: Manual Installation

1. Download `RomanianEIDSDK.xcframework.zip` from [ios/RomanianEIDSDK.xcframework.zip](ios/RomanianEIDSDK.xcframework.zip)
2. Unzip and drag `RomanianEIDSDK.xcframework` to your Xcode project
3. In target settings → General → "Frameworks, Libraries, and Embedded Content"
4. Add the framework and set to "Embed & Sign"

**Complete guide**: See [ios/README.md](ios/README.md)

## 📱 Supported Platforms

| Platform | Minimum Version | NFC Support | Status |
|----------|----------------|-------------|---------|
| **iOS (Native)** | 14.0+ | ✅ iPhone 7+ | ✅ Production Ready |
| **React Native (iOS)** | iOS 14.0+ | ✅ iPhone 7+ | ✅ Production Ready |
| **React Native (Android)** | API 28+ | ✅ | ✅ Production Ready |
| **Flutter (iOS)** | iOS 13.0+ | ✅ iPhone 7+ | 🚧 Beta |
| **Flutter (Android)** | API 24+ | ✅ | 🚧 Beta |

## 📖 Documentation

### Integration Guides
- **[Flutter README](flutter/README.md)** - Complete Flutter integration guide
- **[React Native README](react-native/README.md)** - Complete React Native integration guide
- **[iOS README](ios/README.md)** - Native iOS integration guide
- **[iOS Integration Guide](ios/Documentation/INTEGRATION_GUIDE.md)** - Detailed iOS setup
- **[Flutter Example](flutter/example/)** - Flutter demo application
- **[React Native Example](react-native/example/)** - Working demo application
- **[iOS Demo App](ios/DemoApp/)** - Native iOS example

### Additional Documentation
- **[Changelog](CHANGELOG.md)** - Version history and changes
- **[License](LICENSE.md)** - Commercial license terms

## 💳 Supported Documents

### Romanian ePassport (Pașaport Electronic)
- ✅ Document number and MRZ data
- ✅ Personal information (name, date of birth, nationality)
- ✅ Facial photograph (from chip)
- ✅ CSCA certificate validation
- ✅ Expiry date and issuing authority

### Romanian Electronic ID Card (Carte de Identitate Electronică)
- ✅ CNP (Personal Numeric Code)
- ✅ Full name and personal details
- ✅ Addresses (permanent, temporary, foreign)
- ✅ Facial photograph (from chip)
- ✅ Digital signature
- ✅ Document validity dates
- ✅ CSCA validation

### Old ID Cards (Non-NFC) via OCR
- ✅ Text recognition from physical card
- ✅ CNP extraction
- ✅ Name and address extraction
- ✅ Confidence scoring for reliability

## 🔐 Security & Privacy

- ✅ All NFC communication encrypted using BAC/PACE protocols
- ✅ No data transmitted to external servers
- ✅ CSCA validation performed locally on device
- ✅ Biometric data never leaves the device
- ✅ License validation via JWT (works offline)
- ✅ Full ICAO 9303 compliance
- ✅ Secure PIN/CAN handling

## 📋 Requirements

### Development Environment
- **macOS** 13.0 or later
- **Xcode** 15.0 or later
- **CocoaPods** 1.15 or later (for iOS integration)
- **Node.js** 20.0 or later (for React Native)
- **React Native** 0.76 or later (for React Native integration)

### Runtime Requirements
- **iOS** 14.0 or later
- **iPhone** 7 or later (for NFC functionality)
- Camera access (for MRZ/OCR scanning)
- Valid license key (contact office@up2date.ro)

### iOS Project Configuration

Your app **must** include these in `Info.plist`:

```xml
<key>NFCReaderUsageDescription</key>
<string>We need NFC to read your Romanian eID card or ePassport</string>

<key>NSCameraUsageDescription</key>
<string>We need camera access to scan MRZ codes and perform OCR</string>
```

And add NFC capability with these identifiers in entitlements:

```xml
<key>com.apple.developer.nfc.readersession.iso7816.select-identifiers</key>
<array>
    <string>A0000002471001</string>
    <string>A000000077030C60000000FE00000500</string>
    <string>E828BD080FA000000167454441544100</string>
</array>
```

## 🎯 Usage Examples

### Flutter (Dart)

```dart
import 'package:romanian_eid_sdk/romanian_eid_sdk.dart';

final sdk = RomanianEidSdk();

// Initialize SDK with your license
await sdk.initialize('YOUR_LICENSE_JWT_HERE');

// Listen to reading progress
sdk.progressStream.listen((progress) {
  print('${progress.step}: ${progress.message}');
});

// Read passport via NFC
final passportData = await sdk.readPassport(
  documentNumber: '123456789',
  dateOfBirth: '901231',    // YYMMDD format
  dateOfExpiry: '301231',   // YYMMDD format
);

print('Name: ${passportData.firstName} ${passportData.lastName}');
print('Nationality: ${passportData.nationality}');

// Read ID card via NFC (requires CAN)
final idCardData = await sdk.readIDCard(can: '123456');

print('CNP: ${idCardData.cnp}');
print('Address: ${idCardData.address}');
```

### React Native

```typescript
import RomanianEIDSDK from 'react-native-romanian-eid-sdk';

// Initialize SDK with your license
await RomanianEIDSDK.initialize('YOUR_LICENSE_JWT_HERE');

// Scan MRZ from passport
const mrzResult = await RomanianEIDSDK.startMRZScanning();

// Read passport via NFC
const passportData = await RomanianEIDSDK.readPassport(mrzResult.mrzKey, {
  enableCSCAValidation: true,
  timeout: 60,
});

console.log('Name:', passportData.fullName);
console.log('Valid:', passportData.cscaValidated);

// Read ID card via NFC (requires CAN and PIN)
const idCardData = await RomanianEIDSDK.readIDCard(can, pin, {
  enableCSCAValidation: true,
  readPhoto: true,
  readSignature: true,
});

console.log('CNP:', idCardData.cnp);
console.log('Address:', idCardData.permanentAddress);
```

### Native iOS (Swift)

```swift
import RomanianEIDSDK

// Initialize SDK (do this once at launch)
try EIDLicenseManager.shared.initialize(licenseKey: "YOUR_LICENSE_JWT_HERE")

// Read passport (NFC, BAC/PACE)
let passport = try await EIDReader.shared.readPassport(
    mrzKey: mrzKey,
    options: PassportReadOptions(enableCSCAValidation: true, timeout: 60)
)
print("Name:", passport.fullName, "CNP:", passport.cnp ?? "-")

// Read eID card (NFC, PACE + PIN)
let card = try await EIDReader.shared.readIDCard(
    can: can,
    pin: pin,                       // data PIN, 4–8 digits
    options: IDCardReadOptions(
        enableCSCAValidation: true,
        readPhoto: true,
        readSignature: true
    )
)
print("CNP:", card.cnp, "Address:", card.permanentAddress ?? "-")

// Sign a precomputed hash with the on-card eSign sub-application
let result = try await EIDReader.shared.signHash(
    hash: sha384OfPDF,              // 48 bytes
    can: can,
    signingPIN: signingPIN,          // the *signing* PIN (separate from data PIN)
    options: SigningOptions(hashAlgorithm: .sha384)
)
// result.signature  : raw r||s from the card
// result.certificate: DER-encoded X.509 signer certificate

// Runtime language switch (no app restart)
EIDLocalization.setLanguage("ro")    // or "en", or nil for system default
```

## 🐛 Troubleshooting

### Common Issues

**❌ NFC not working**
✅ Solution: Ensure you're using a physical device (iPhone 7 or later). NFC does not work in the iOS Simulator. Verify entitlements are properly configured.

**❌ License validation fails**
✅ Solution: Verify your license JWT is valid and not expired. Contact office@up2date.ro for license renewal or support.

**❌ Build errors with XCFramework**
✅ Solution: Clean build folder (⌘+Shift+K in Xcode), delete DerivedData, run `pod install` again, and rebuild.

**❌ React Native: "Native module cannot be null"**
✅ Solution: Run `cd ios && pod install && cd ..`, then clean and rebuild the iOS project.

**❌ Camera permission denied**
✅ Solution: Check that NSCameraUsageDescription is in Info.plist. Ask user to enable camera in Settings if denied.

**❌ "Invalid MRZ key" error**
✅ Solution: Ensure MRZ was scanned correctly. MRZ key format must include document number + DOB + expiry with check digits.

### Getting Help

📧 **Email**: office@up2date.ro
📖 **Documentation**: Check [ios/README.md](ios/README.md) and [react-native/README.md](react-native/README.md)
🐛 **Issues**: [GitHub Issues](https://github.com/Up2dateSoftware/EidRomaniaSDK/issues)
💬 **Response Time**: 24-48 hours (Monday-Friday, 9:00-17:00 EET)

## 📄 License & Pricing

This SDK is **commercial software**. A valid license key is required for production use.

### License Options

| License Type | Description | Use Case |
|-------------|-------------|----------|
| **Trial** | Free evaluation license | Testing and development (30 days) |
| **Development** | Development license | Internal testing and development |
| **Production** | Production deployment license | Live applications |
| **Enterprise** | Custom terms | High-volume or source code access |

**Note**: Trial licenses do not have scan limits. All licenses are time-based.

### Get a License

**Contact**: office@up2date.ro
**Website**: https://up2date.ro

Include in your request:
- Company name
- Intended use case
- Expected volume
- iOS and/or Android
- React Native or native

## 🔄 Version History

### Version 1.4.23 (Current)
- ✅ **Added**: Runtime language switching via `EIDLocalization.setLanguage(_:)`
  with `languageDidChangeNotification` for live UI refresh
- ✅ **Added**: Document signing API – `EIDReader.shared.signHash(hash:can:signingPIN:options:)`
  – calibrated for the Romanian CEI / IDEMIA eSign sub-application (ECDSA P-384 / SHA-384)
- ✅ **Added**: PAdES B-B inline + CAdES detached signing example in the demo app
- ✅ **Added**: `MRZScanResult`, `OCRScanResult`, `CardSignatureResult` public models
- ✅ **Added**: Keychain-backed persistence for passport + ID card results
- ✅ **Fixed**: ID card tag mapping (0x81 = issue, 0x82 = expiry, 0x83 = authority)
- ✅ **Fixed**: Main-thread crashes during NFC alert/invalidate and camera presentation
- ✅ **Changed**: `readIDCard` now requires both `can` and `pin`
- ✅ **Changed**: Minimum iOS bumped to 15.0 (for PACE + signing flow)

### Version 1.4.0
- ✅ MRZ scanner (Vision-based) with TD3 detection
- ✅ Performance pass – removed all debug logging from hot paths
- ✅ Documentation overhaul

### Version 1.3.0
- Added OCR scanning for old non-NFC cards
- Improved MRZ detection accuracy
- Enhanced license validation
- Face ID/Touch ID integration for secure PIN storage

For complete version history, see [CHANGELOG.md](CHANGELOG.md)

## 🤝 Support & Contact

### Technical Support
**Email**: office@up2date.ro
**Hours**: Monday - Friday, 9:00 - 17:00 EET
**Response**: Usually within 24-48 hours

### Sales & Licensing
**Email**: office@up2date.ro
**Website**: https://up2date.ro

### About Up2Date Software

**Up2Date Software** is a leading Romanian software development company with over **15 years of experience** (since 2009), transforming innovative ideas into robust digital solutions.

#### Our Expertise
- 🏢 **Mobile Development**: Native iOS/Android and cross-platform applications optimized for performance
- 🌐 **Web Applications**: Modern, scalable solutions using Laravel, React, Next.js, FilamentPHP
- 🤖 **AI Automation**: Intelligent automation and process optimization
- 🔐 **Security Solutions**: eID, biometric systems, NFC document reading, secure authentication
- 📱 **Document Verification**: Specialized in Romanian identity document processing

#### Track Record
- ✅ **200+ Projects** successfully delivered
- ✅ **98% Client Satisfaction** rate
- ✅ **15+ Years** in software development (since 2009)
- ✅ Trusted by major clients including BRD - Groupe Société Générale, Selgros Cash & Carry, B&H Photo Video (USA)

#### Technologies We Master
React • Next.js • Laravel • FilamentPHP • Swift • Kotlin • React Native • OpenAI • Node.js

#### Why Choose Up2Date
- ✓ Proven expertise in complex security solutions
- ✓ Modern technology stack and best practices
- ✓ Dedicated technical support
- ✓ Agile development methodology
- ✓ Competitive pricing
- ✓ Enterprise-grade security

**Office**: Bulevardul Pipera nr.1/VII, Nord City Tower, etaj 7, Voluntari, Ilfov, Romania
**Contact**: office@up2date.ro | +40-729-126-097
**Website**: [www.up2date.ro](https://www.up2date.ro)

**Developed by**: [Up2Date Software SRL](https://up2date.ro)
**Copyright**: © 2009-2025 Up2Date Software SRL. All rights reserved.

---

## 📚 Additional Resources

- 📘 [Flutter Integration Guide](flutter/README.md)
- 📘 [React Native Integration Guide](react-native/README.md)
- 📗 [iOS Integration Guide](ios/README.md)
- 📙 [Detailed iOS Setup](ios/Documentation/INTEGRATION_GUIDE.md)
- 🎯 [Flutter Example App](flutter/example/)
- 🎯 [React Native Example App](react-native/example/)
- 🎯 [iOS Demo App](ios/DemoApp/)
- 📋 [Changelog](CHANGELOG.md)

---

**Ready to integrate?** Check out our [example applications](react-native/example/) or contact office@up2date.ro for a license key!
