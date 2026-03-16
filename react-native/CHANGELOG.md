# Changelog

All notable changes to the Romanian eID SDK for React Native will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.8] - 2025-01-17

### Fixed

- Added missing import for `AuthenticationResult` class in Kotlin module

## [1.4.7] - 2025-01-17

### Added

- **Detailed Authentication Result** - NEW `authenticationResult` property in `IDCardResult`
  - Provides comprehensive CSCA validation details from Passive Authentication
  - Status: `authentic` (all checks passed), `failed` (card suspect/fake), or `warning` (partial verification)
  - Includes message, reason (for failures), and additional details
  - Replaces legacy `cscaValidated` boolean with richer information
- Added `dateOfIssue` property to `IDCardResult` for issue date

### Fixed

- **BREAKING**: Fixed property naming inconsistency in `IDCardResult`
  - Changed `issueDate` → `dateOfIssue` (consistent with SDK)
  - Changed `expiryDate` → `dateOfExpiry` (consistent with SDK)
  - These changes ensure property names match the Android native SDK exactly
- Added `address` field to `IDCardResult` for general address information

### Improved

- Enhanced TypeScript definitions with `AuthenticationResult` interface
- Better documentation for Passive Authentication process (SOD signature, hash verification, CSCA chain)
- Backward compatibility maintained with deprecated legacy fields (`cscaValidated`, `cscaCountry`, `cscaValidationMessage`)

### Technical Details

**Authentication Result** provides three possible statuses:
- **Authentic**: Card is genuine, all verifications passed (SOD signature valid, hashes match, CSCA chain verified)
- **Failed**: Card is suspect or fake (invalid signature, modified data, or invalid certificate) - **DO NOT ACCEPT**
- **Warning**: Partial verification (e.g., CSCA certificate not available but SOD signature and hashes are valid)

## [1.2.5] - 2025-01-17

### Changed

- **Android Native SDK upgraded to v1.5.3** (from v1.3.0)
  - Improved NFC card reading reliability
  - Enhanced error handling and validation
  - Bug fixes and performance improvements in native SDK
- Added GitHub Packages authentication configuration for automatic SDK download

### Improved

- Added detailed error logging for debugging card reading issues
- Enhanced parameter validation logging (CAN/PIN lengths without revealing values)
- Better error messages and stack traces for troubleshooting

## [1.2.4] - 2025-01-17

### Changed

- **Android Native SDK upgraded to v1.5.3** (from v1.3.0)
  - Improved NFC card reading reliability
  - Enhanced error handling and validation
  - Bug fixes and performance improvements in native SDK

### Improved

- Added detailed error logging for debugging card reading issues
- Enhanced parameter validation logging (CAN/PIN lengths without revealing values)
- Better error messages and stack traces for troubleshooting

## [1.2.3] - 2025-01-17

### Fixed

- **CRITICAL**: Fixed "Map already consumed" error when reading ID cards
  - WritableMap objects can only be consumed once by React Native bridge
  - Now creates separate map instances for event emission and promise resolution
  - Prevents ObjectAlreadyConsumedException during successful card reads
- Added defensive error handling for all event emissions
- Improved logging for event emission failures

### Technical Details

The issue occurred because the same WritableMap was used for both:
1. Sending completion event (`sendEvent(EVENT_READ_COMPLETE, completeEvent)`)
2. Resolving the promise (`promise.resolve(cardMap)`)

Once a WritableMap is passed through the bridge (via putMap or emit), it becomes consumed and cannot be reused. The fix creates two independent map instances by calling `convertCardToMap(card)` twice.

## [1.2.2] - 2025-01-17

### Fixed

- Fixed automatic NFC lifecycle registration by moving it to ReactPackage initialization
- Added @JvmStatic annotation to NFCLifecycleManager.register() for proper Java interoperability
- NFC lifecycle manager now registers reliably when SDK package loads

### Improved

- Enhanced logging in NFCLifecycleManager for better debugging
- Improved Package-level registration ensures NFC is ready before first SDK method call

## [1.2.1] - 2025-01-17

### Documentation

- Updated README with comprehensive automatic NFC setup guide
- Added "What's New in v1.2.0" section highlighting automatic NFC management
- Improved Android setup instructions with step-by-step NFC configuration
- Added migration guide from v1.1.x to v1.2.x
- Created CHANGELOG.md to track all version changes
- Clarified that MainActivity requires zero NFC code with v1.2.0+

### Fixed

- Updated package name references in documentation to use correct npm package name

## [1.2.0] - 2025-01-17

### Added

- **Automatic NFC Lifecycle Management** - Revolutionary new feature that eliminates manual NFC setup
  - `NFCLifecycleManager` class for automatic NFC event handling
  - `EIDReactActivity` optional base class for enhanced NFC support
  - Automatic registration of NFC lifecycle callbacks when SDK is imported
  - Zero-configuration NFC detection and card reading

### Changed

- Android minimum API level increased to 28 (Android Pie)
- NFC handling now fully automatic - no MainActivity code needed
- Simplified Android setup documentation

### Improved

- Developer experience: removed 50+ lines of boilerplate NFC code requirement
- Better error handling for NFC lifecycle events
- More detailed logging for NFC operations

### Migration Guide (from v1.1.x)

If you're upgrading from v1.1.x:

1. Update package:
   ```bash
   npm install @up2date/romanian-eid-sdk@1.2.0
   ```

2. **Remove manual NFC code from MainActivity** (if you had any):
   ```kotlin
   // ❌ DELETE all this code - no longer needed!
   private var nfcAdapter: NfcAdapter? = null
   private var pendingIntent: PendingIntent? = null

   override fun onCreate(...) {
     // DELETE NFC initialization code
   }

   override fun onResume() {
     // DELETE enableForegroundDispatch code
   }

   override fun onPause() {
     // DELETE disableForegroundDispatch code
   }

   override fun onNewIntent(...) {
     // DELETE NFC intent handling code
   }
   ```

3. **Keep your MainActivity simple:**
   ```kotlin
   // ✅ This is all you need now!
   class MainActivity : ReactActivity() {
     override fun getMainComponentName(): String = "YourApp"
   }
   ```

4. **Keep AndroidManifest.xml permissions and intent filters** - these are still required:
   - NFC permissions
   - NFC intent filters
   - nfc_tech_filter.xml resource

That's it! NFC will work automatically.

## [1.1.1] - 2025-01-16

### Fixed

- Improved license validation error messages
- Fixed TypeScript type definitions for result objects

### Changed

- Updated documentation with clearer examples
- Improved error codes consistency

## [1.1.0] - 2025-01-15

### Added

- Full Android implementation with Kotlin bridge
- Support for Romanian ID card reading on Android
- Support for Romanian passport reading on Android
- CSCA validation on Android
- Photo and signature extraction on Android
- Progress event callbacks for Android

### Changed

- Updated native SDK to v1.3.0
- Improved error handling across both platforms

## [1.0.0] - 2025-01-10

### Added

- Initial release
- iOS support for Romanian ePassport reading
- iOS support for Romanian ID card reading
- MRZ scanning functionality
- OCR scanning for old ID cards
- CSCA validation
- Biometric data extraction (photos, signatures)
- TypeScript definitions
- Example app
- Complete documentation

[1.2.0]: https://github.com/up2datesoftware/RNRomanianEIDSDK/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/up2datesoftware/RNRomanianEIDSDK/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/up2datesoftware/RNRomanianEIDSDK/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/up2datesoftware/RNRomanianEIDSDK/releases/tag/v1.0.0
