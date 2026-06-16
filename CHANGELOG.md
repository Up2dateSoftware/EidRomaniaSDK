# Changelog

All notable changes to the Romanian eID SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.23] - 2026-06-16

### iOS SDK

#### Added
- **Public `EIDLocalization` API** for runtime language switching:
  `setLanguage(_:)`, `languageDidChangeNotification`, `currentLanguage`,
  `availableLanguages`, `localizedString(forKey:)`. NFC alert messages,
  progress callbacks and `EIDError.localizedDescription` all follow the
  override immediately – no app restart required.

#### Changed
- Full sweep of internal Romanian-only strings through the `L10n` helper
  across CSCAValidator, PassportBACReader, CompleteRomanianEIDReader,
  the OCR / MRZ camera view controllers, the smart card reader and the
  NFCPassportModel extensions. `Localizable.strings` expanded to ~85
  keys (en + ro) covering NFC alerts, progress callbacks, signing flow,
  validation issues, MRZ/OCR camera UI, data group names, finger
  positions and status enums.
- README rewritten to document the current public API surface
  (`signHash`, `EIDLocalization`, MRZ/OCR camera flows, Keychain
  persistence, full `EIDError` surface).
- SDK version constant bumped to `1.4.23`.

No breaking changes vs 1.4.22.

## [1.4.22] - 2026-06-16

### iOS SDK

#### Added
- **Document signing (eSign sub-application)** calibrated for the
  Romanian CEI / IDEMIA card profile. The applet selection, PIN2
  reference, key reference, MSE:SET Authentication Template and
  INTERNAL AUTHENTICATE sequence now match what the official IDEMIA
  middleware uses (parameters captured via APDU trace by the
  am-semnat-ios-sdk project).
- **PAdES B-B inline signing** demo in the example app: PDF picker,
  on-page signature placement, native XObject Form appearance, ECDSA
  P-384 + SHA-384 with re-encoding of the raw `r||s` card output into
  the canonical ECDSA-Sig-Value DER, `/ByteRange` patching and CMS
  embed into `/Contents` (plus a `.p7s` CAdES-detached sidecar and a
  DocMDP certifying lock).
- Romanian and English `Localizable.strings` + an internal `L10n`
  helper.

#### Changed
- `Package.swift` declares `defaultLocalization: "en"` – required by
  SwiftPM once a target ships localized resources.

No breaking changes vs 1.4.21.

## [1.4.21] - 2026-06-05

### iOS SDK

#### Fixed
- **Main-thread crash on passport (MRZ) reading** - `NFCTagReaderSession.begin()`,
  `alertMessage` updates and `invalidate(...)` are now always dispatched onto the
  main queue from `PassportReader`, preventing
  `NSInternalInconsistencyException: 'Call must be made on main thread'` when the
  public async API is called from a background `Task`.
- **Main-thread crash on Romanian ID card reading** - Centralized all NFC alert
  message updates in `CompleteRomanianEIDReader` through a main-thread helper and
  wrapped post-flow `session.alertMessage` / `session.invalidate(...)` calls in a
  `DispatchQueue.main.async` block.
- **Main-thread crash on OCR / MRZ camera presentation** - `UIViewController.present`
  and `dismiss` for the OCR and MRZ camera screens are now dispatched on the main
  queue inside `EIDReader.startOCRScanning(from:)` and `startMRZScanning(from:)`.

No public API changes. Drop-in upgrade from 1.4.20.

## [1.4.0] - 2025-11-13

### iOS SDK

#### Added
- **MRZ Scanner** - Camera-based Machine Readable Zone scanning for passports
  - Real-time Vision OCR with text recognition
  - Automatic MRZ format detection (TD3 - two lines × 44 characters)
  - OCR error correction for common character confusions (O/0, I/1, etc.)
  - Visual feedback with target rectangle overlay
  - Public API: `EIDReader.shared.startMRZScanning(from:delegate:)`
  - New model: `MRZScanResult` with JSON serialization support
  - Thread-safe implementation with Main Actor isolation

#### Improved
- **Performance Optimization** - Removed all debug logging (226 statements)
  - Eliminated `Logger` statements from NFC reading operations
  - Removed `print` statements from OCR service
  - Removed debug logging from PACE/BAC handlers
  - Silent operation in production builds for better performance
  - Reduced memory footprint during NFC sessions

- **Documentation** - Complete SDK documentation overhaul
  - Comprehensive README with API examples
  - Step-by-step integration guide
  - Complete changelog with detailed version history
  - License documentation with tier information
  - Swift Package Manager support with binary distribution

#### Fixed
- MRZ parsing edge cases for special characters
- Memory leaks in NFC session management
- Thread safety issues in OCR scanning

### React Native SDK

#### Added
- TypeScript definitions for all APIs
- Complete React Native bridge for iOS
- Event listeners for progress updates
- Error code constants for error handling

#### In Progress
- 🚧 Android native implementation (see ANDROID_TODO.md)

### Repository Structure

#### Added
- Multi-platform repository structure
  - `ios/` - iOS native SDK with Swift Package Manager
  - `android/` - Android native SDK (coming soon)
  - `react-native/` - React Native bridge
  - `docs/` - Cross-platform documentation
  - `examples/` - Platform-specific examples

## [1.3.0] - 2025-10-15

### iOS SDK

#### Added
- OCR scanning for old non-NFC ID cards
- Multi-pass OCR with confidence scoring
- Visual feedback during OCR capture
- CNP validation and checksum verification

#### Improved
- CSCA validation performance
- NFC reading stability
- Error messages and handling

## [1.2.0] - 2025-09-01

### iOS SDK

#### Added
- CSCA certificate validation for document authenticity
- Support for Romanian CSCA certificates
- Configurable validation options
- Validation status in result models

#### Improved
- PACE authentication reliability
- Photo extraction quality
- Memory management during NFC sessions

## [1.1.0] - 2025-07-15

### iOS SDK

#### Added
- Passport reading with BAC authentication
- DG11 parsing for extended passport data (CNP, place of birth, residence)
- Signature extraction from passports
- Phone number extraction from Romanian ePassports

#### Improved
- ID card reading speed
- Error handling and user feedback
- Documentation and code examples

#### Fixed
- Issue with long NFC sessions timing out
- Photo extraction for certain card types

## [1.0.0] - 2025-06-01

### iOS SDK

#### Added
- Initial release of Romanian eID SDK for iOS
- NFC reading for Romanian electronic ID cards
- PACE authentication with CAN
- Personal data extraction (CNP, name, addresses, dates)
- Facial photo extraction from chip
- JWT-based license system
- SwiftUI example application
- Comprehensive error handling

### Features
- Full PACE protocol support
- ISO7816 tag communication
- AES/3DES encryption
- Secure messaging
- Thread-safe NFC operations

---

## Version Support Matrix

| SDK Version | iOS | Android | React Native | Swift | Kotlin |
|-------------|-----|---------|--------------|-------|--------|
| 1.4.0 | 17.6+ | - | 0.70+ (iOS only) | 5.9+ | - |
| 1.3.0 | 17.0+ | - | - | 5.9+ | - |
| 1.2.0 | 16.0+ | - | - | 5.8+ | - |
| 1.1.0 | 16.0+ | - | - | 5.8+ | - |
| 1.0.0 | 15.0+ | - | - | 5.7+ | - |

---

## Upcoming Features

### Q1 2026
- [ ] Android native SDK release
- [ ] React Native Android support completion
- [ ] CocoaPods distribution for iOS
- [ ] Maven Central distribution for Android

### Q2 2026
- [ ] Flutter plugin
- [ ] Web SDK with WebNFC API
- [ ] Advanced document security verification
- [ ] Liveness detection

### Future
- [ ] Support for other EU country documents
- [ ] Document expiry notifications
- [ ] Batch document processing
- [ ] Cloud-based license management portal

---

## Migration Guides

### Migrating from 1.3.0 to 1.4.0

**New MRZ Scanner API:**

```swift
// Old: Manual MRZ entry
let passport = try await EIDReader.shared.readPassport(
    mrzKey: manuallyEnteredMRZ,
    options: options
)

// New: MRZ Scanner
let mrzResult = try await EIDReader.shared.startMRZScanning(from: self)
let passport = try await EIDReader.shared.readPassport(
    mrzKey: mrzResult.mrzKey,
    options: options
)
```

**No Breaking Changes** - Version 1.4.0 is fully backward compatible with 1.3.0.

---

## License

See [LICENSE.md](LICENSE.md) for license information.

## Support

For questions, issues, or feature requests:
- 📧 Email: support@up2date.ro
- 🐛 Issues: [GitHub Issues](https://github.com/Up2dateSoftware/EidRomaniaSDK/issues)
- 📖 Docs: [Documentation](https://docs.up2date.ro/eid-sdk)

---

© 2025 Up2Date Software. All rights reserved.
