# Romanian eID SDK for React Native

Romanian eID & Passport NFC Reader SDK for React Native. Read Romanian electronic identity documents (ePassports and ID cards) using NFC technology.

[![npm version](https://badge.fury.io/js/@up2date%2Fromanian-eid-sdk.svg)](https://badge.fury.io/js/@up2date%2Fromanian-eid-sdk)
[![License](https://img.shields.io/badge/license-Commercial-blue.svg)](LICENSE)

## What's New in v1.4.8 🎉

**Enhanced CSCA Validation & SDK Upgrade!**

### New Features (v1.4.7-1.4.8)
- ✨ **Detailed Authentication Result** - NEW `authenticationResult` property with comprehensive CSCA validation details
- 🔒 **Three Security Levels** - `authentic` (all checks passed), `failed` (card suspect), `warning` (partial verification)
- 📊 **Rich Validation Info** - Status, message, reason for failures, and additional details
- 🔄 **Android SDK v1.5.3** - Improved NFC reliability, enhanced error handling, bug fixes

### Previous Major Update (v1.2.0)

**Automatic NFC Lifecycle Management:**
- ✨ **Zero Configuration NFC** - No more manual NFC setup code in MainActivity
- 🔄 **Automatic Lifecycle Handling** - SDK manages all NFC events automatically
- 🚀 **Simplified Integration** - Just add permissions & intent filters, that's it!
- 📱 **Works Out of the Box** - NFC detection and card reading work immediately

### Property Name Changes (v1.4.7)
⚠️ **Breaking Changes** - Property names now match Android SDK:
- `issueDate` → `dateOfIssue`
- `expiryDate` → `dateOfExpiry`
- Added: `address` field for general address information
- Deprecated (but still available): `cscaValidated`, `cscaCountry`, `cscaValidationMessage`

## Features

- ✅ **NFC Passport Reading** - Read Romanian ePassports using BAC/PACE protocols
- ✅ **NFC ID Card Reading** - Read Romanian electronic ID cards using PACE
- ✅ **Automatic NFC Handling** - Zero configuration NFC setup
- ✅ **Detailed CSCA Validation** - Comprehensive Passive Authentication with status, reasons, and details (NEW in v1.4.7!)
- ✅ **MRZ Scanning** - Camera-based MRZ (Machine Readable Zone) scanning
- ✅ **OCR Scanning** - Extract data from old non-NFC ID cards using OCR
- ✅ **Biometric Extraction** - Extract photos and signatures from documents
- ✅ **ICAO 9303 Compliant** - Full compliance with international standards
- ✅ **License Management** - Secure JWT-based license system
- ✅ **TypeScript Support** - Full TypeScript definitions included
- ✅ **Android SDK v1.5.3** - Latest native SDK with improved reliability (NEW in v1.4.7!)

## Installation

```bash
npm install @up2date/romanian-eid-sdk
# or
yarn add @up2date/romanian-eid-sdk
```

### iOS Setup

1. Install CocoaPods dependencies:

```bash
cd ios && pod install
```

> **Note:** The SDK uses React Native autolinking - no manual Podfile configuration needed! If you have an old manual pod reference like `pod 'RNRomanianEIDSDK', :path => ...`, please remove it.

2. Add required capabilities to your `Info.plist`:

```xml
<!-- NFC Reading -->
<key>NFCReaderUsageDescription</key>
<string>This app needs NFC to read electronic identity documents</string>

<!-- NFC ISO7816 Identifiers -->
<key>com.apple.developer.nfc.readersession.iso7816.select-identifiers</key>
<array>
    <string>A0000002471001</string>
    <string>A000000077030C60000000FE00000500</string>
    <string>E828BD080FA000000167454441544100</string>
</array>

<!-- Camera (for MRZ/OCR scanning) -->
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan documents</string>
```

3. Enable NFC capability in Xcode:
   - Open your project in Xcode
   - Select your target → Signing & Capabilities
   - Click "+ Capability" → Near Field Communication Tag Reading

4. Add the `RomanianEIDSDK.xcframework` to your project (already included in the pod).

### Android Setup

#### 1. Add NFC Permissions and Intent Filters

Add the following to your `AndroidManifest.xml`:

```xml
<!-- Permissions -->
<uses-permission android:name="android.permission.NFC" />
<uses-permission android:name="android.permission.CAMERA" />

<uses-feature
    android:name="android.hardware.nfc"
    android:required="false" />
<uses-feature
    android:name="android.hardware.camera"
    android:required="false" />

<application ...>
    <activity
        android:name=".MainActivity"
        android:exported="true"
        android:launchMode="singleTask">

        <!-- Your existing intent filters -->
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>

        <!-- NFC intent filters for automatic card detection -->
        <intent-filter>
            <action android:name="android.nfc.action.TECH_DISCOVERED" />
        </intent-filter>
        <meta-data
            android:name="android.nfc.action.TECH_DISCOVERED"
            android:resource="@xml/nfc_tech_filter" />
    </activity>
</application>
```

#### 2. Create NFC Tech Filter

Create file `android/app/src/main/res/xml/nfc_tech_filter.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:xliff="urn:oasis:names:tc:xliff:document:1.2">
    <!-- NFC tech list for ISO-DEP (used by eID cards) -->
    <tech-list>
        <tech>android.nfc.tech.IsoDep</tech>
    </tech-list>
</resources>
```

#### 3. Update MainActivity to Extend EIDReactActivity

Update your `MainActivity.kt` to extend `EIDReactActivity` instead of `ReactActivity`:

```kotlin
package com.yourapp

import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.rnromanianeidsdk.EIDReactActivity

class MainActivity : EIDReactActivity() {

  override fun getMainComponentName(): String = "YourApp"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
```

**That's it!** 🎉 By extending `EIDReactActivity`, the SDK automatically handles all NFC lifecycle management:
- Registers for NFC events when the app starts
- Enables/disables NFC foreground dispatch as needed
- Detects and processes NFC cards automatically
- Handles all activity lifecycle callbacks

> **Note:** The key change from standard React Native is using `EIDReactActivity` instead of `ReactActivity`. This provides automatic NFC lifecycle management without any additional code.

## Quick Start

### 1. Initialize SDK

```typescript
import EIDReader from '@up2date/romanian-eid-sdk';

// Initialize with your license key
await EIDReader.initialize('YOUR_LICENSE_KEY_JWT');
```

### 2. Read a Passport

```typescript
// Scan MRZ first (optional, or enter manually)
const mrzResult = await EIDReader.startMRZScanning();

// Read passport via NFC
const result = await EIDReader.readPassport(mrzResult.mrzKey, {
  enableCSCAValidation: true,
  timeout: 60,
});

console.log('Name:', result.fullName);
console.log('Document:', result.documentNumber);
console.log('Photo:', result.facialImageBase64); // base64 encoded image
```

### 3. Read an ID Card

```typescript
// Read electronic ID card via NFC
const result = await EIDReader.readIDCard(
  '123456', // CAN (6 digits)
  '1234',   // PIN (4-8 digits)
  {
    enableCSCAValidation: true,
    readPhoto: true,
    readSignature: true,
    timeout: 90,
  }
);

// Check authentication result (NEW in v1.4.7!)
if (result.authenticationResult) {
  switch (result.authenticationResult.status) {
    case 'authentic':
      console.log('✅ Card is authentic!');
      console.log(result.authenticationResult.message);
      // Safe to use card data
      break;

    case 'failed':
      console.error('❌ Card authentication FAILED!');
      console.error('Reason:', result.authenticationResult.reason);
      console.error('Details:', result.authenticationResult.details);
      // DO NOT accept this card as valid
      return;

    case 'warning':
      console.warn('⚠️ Partial authentication');
      console.warn(result.authenticationResult.message);
      // Decide based on your security policy
      break;
  }
}

console.log('CNP:', result.cnp);
console.log('Name:', result.fullName);
console.log('Date of Issue:', result.dateOfIssue);
console.log('Date of Expiry:', result.dateOfExpiry);
console.log('Address:', result.address);
console.log('Photo:', result.facialImageBase64 ? 'Available' : 'N/A');
```

### 4. Scan Old ID Card (OCR)

```typescript
// For old non-NFC ID cards
const result = await EIDReader.startOCRScanning();

if (result.isReliable) {
  console.log('CNP:', result.cnp);
  console.log('Name:', result.fullName);
  console.log('Confidence:', result.confidence);
} else {
  console.warn('Low confidence:', result.validationIssues);
}
```

## API Reference

### Main Methods

#### `initialize(license: string): Promise<boolean>`

Initialize SDK with license key.

```typescript
await EIDReader.initialize('eyJhbGciOiJIUzI1NiIs...');
```

#### `readPassport(mrzKey: string, options?: PassportReadOptions): Promise<PassportResult>`

Read Romanian ePassport via NFC.

**Parameters:**
- `mrzKey` - MRZ key (format: DocumentNumber+DOB+Expiry with check digits)
- `options` - Optional configuration

**Options:**
```typescript
{
  enableCSCAValidation?: boolean; // Default: true
  timeout?: number;                // Default: 60 seconds
}
```

**Returns:** `PassportResult` with document data and biometrics.

#### `readIDCard(can: string, pin: string, options?: IDCardReadOptions): Promise<IDCardResult>`

Read Romanian electronic ID card via NFC.

**Parameters:**
- `can` - Card Access Number (6 digits printed on card)
- `pin` - Personal PIN (4-8 digits)
- `options` - Optional configuration

**Options:**
```typescript
{
  enableCSCAValidation?: boolean; // Default: true
  readPhoto?: boolean;             // Default: true
  readSignature?: boolean;         // Default: true
  timeout?: number;                // Default: 90 seconds
}
```

**Returns:** `IDCardResult` with personal data, addresses, and biometrics.

#### `startMRZScanning(): Promise<MRZScanResult>`

Open camera to scan MRZ from passport.

**Returns:** `MRZScanResult` with parsed MRZ data and `mrzKey` for NFC reading.

#### `startOCRScanning(): Promise<OCRScanResult>`

Open camera to scan old non-NFC ID card using OCR.

**Returns:** `OCRScanResult` with extracted data and confidence scores.

#### `isNFCAvailable(): Promise<boolean>`

Check if NFC is available and SDK is initialized.

#### `getLicenseInfo(): Promise<LicenseInfo>`

Get current license information.

### Event Listeners

```typescript
// Progress updates during NFC reading
const subscription = EIDReader.onReadProgress((event) => {
  console.log(`${event.percentage}%: ${event.message}`);
});

// Remember to unsubscribe
subscription.remove();
// or
EIDReader.removeAllListeners();
```

### Result Types

#### PassportResult

```typescript
{
  success: boolean;
  documentNumber: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  sex: string;
  dateOfExpiry: string;
  cnp?: string;
  placeOfBirth?: string;
  residenceAddress?: string;
  phoneNumber?: string;
  facialImageBase64?: string;      // JPEG base64
  signatureImageBase64?: string;   // PNG base64
  cscaValidated: boolean;
  cscaCountry?: string;
  errorMessage?: string;
}
```

#### IDCardResult

```typescript
{
  success: boolean;
  documentNumber: string;
  cnp: string;
  fullName: string;
  dateOfBirth: string;
  sex: string;
  dateOfExpiry: string;        // Updated property name (v1.4.7)
  dateOfIssue?: string;         // Updated property name (v1.4.7)
  issuingAuthority?: string;
  placeOfBirth?: string;
  citizenship?: string;
  address?: string;             // NEW in v1.4.7
  permanentAddress?: string;
  temporaryAddress?: string;
  foreignAddress?: string;
  facialImageBase64?: string;
  signatureImageBase64?: string;

  // NEW in v1.4.7: Detailed authentication result
  authenticationResult?: {
    status: 'authentic' | 'failed' | 'warning';
    message: string;
    reason?: string;    // Only present when status is "failed"
    details?: string;
  };

  // Deprecated fields (for backward compatibility)
  cscaValidated: boolean;       // Use authenticationResult.status instead
  cscaCountry?: string;         // Use authenticationResult.details instead
  cscaValidationMessage?: string; // Use authenticationResult.message instead

  errorMessage?: string;
}
```

## Error Handling

```typescript
try {
  const result = await EIDReader.readPassport(mrzKey);
} catch (error) {
  switch (error.code) {
    case 'NFC_NOT_AVAILABLE':
      console.error('NFC not available on this device');
      break;
    case 'INVALID_MRZ':
      console.error('Invalid MRZ key');
      break;
    case 'USER_CANCELLED':
      console.log('User cancelled the operation');
      break;
    case 'READ_TIMEOUT':
      console.error('Reading timed out');
      break;
    case 'LICENSE_INVALID':
      console.error('Invalid or expired license');
      break;
    default:
      console.error('Error:', error.message);
  }
}
```

## Authentication Result (CSCA Validation)

Starting with v1.4.7, the SDK provides detailed authentication results through the `authenticationResult` property. This indicates whether the electronic ID card is authentic and if the data has not been tampered with.

### What is Passive Authentication?

Passive Authentication (PA) is a security mechanism that verifies:

1. **SOD Signature** - The Security Object Document (SOD) is signed by the Document Signer (DS) certificate
2. **Data Integrity** - Hashes of all data groups (DG1, DG2, etc.) match the hashes stored in the SOD
3. **Certificate Chain** - The DS certificate is signed by a trusted Country Signing Certificate Authority (CSCA)

### Authentication Status Levels

The `authenticationResult.status` field can have three values:

#### `authentic` - Card is Genuine ✅

All security checks passed. The card is authentic and data has not been modified.

```typescript
if (result.authenticationResult?.status === 'authentic') {
  // Safe to trust all data from the card
  console.log('Card verified:', result.authenticationResult.message);
  // Proceed with user registration/authentication
}
```

#### `failed` - Card is Suspect or Fake ❌

Critical security checks failed. The card may be counterfeit or data has been tampered with.

```typescript
if (result.authenticationResult?.status === 'failed') {
  console.error('SECURITY ALERT!');
  console.error('Reason:', result.authenticationResult.reason);
  console.error('Details:', result.authenticationResult.details);

  // DO NOT accept this card
  // Log the incident for security review
  // Alert security personnel
}
```

**Common failure reasons:**
- Invalid SOD signature
- Data hash mismatch (tampered data)
- Invalid certificate chain
- Expired or revoked certificates

#### `warning` - Partial Verification ⚠️

Some checks passed, but complete verification couldn't be performed. Decide based on your security policy.

```typescript
if (result.authenticationResult?.status === 'warning') {
  console.warn('Partial verification:', result.authenticationResult.message);

  // Example: CSCA certificate not available in local database
  // Decision depends on your security requirements:
  // - High security: Reject and request alternative ID
  // - Medium security: Accept with additional verification steps
  // - Low security: Accept with logged warning
}
```

**Common warning reasons:**
- CSCA certificate not available in local database
- Offline mode with incomplete certificate store
- New CSCA certificates not yet synchronized

### Best Practices

1. **Always Enable CSCA Validation**
   ```typescript
   const result = await EIDReader.readIDCard(can, pin, {
     enableCSCAValidation: true  // Recommended!
   });
   ```

2. **Handle All Three Status Cases**
   ```typescript
   switch (result.authenticationResult?.status) {
     case 'authentic':
       // Proceed normally
       break;
     case 'failed':
       // Reject and alert security
       break;
     case 'warning':
       // Apply your security policy
       break;
   }
   ```

3. **Log Authentication Results**
   - Log all failed authentications for security review
   - Monitor warning patterns to identify missing certificates
   - Keep audit trail for compliance

4. **Backward Compatibility**
   - The legacy `cscaValidated` boolean field is still available
   - For new code, always use `authenticationResult` for more detail

### Migration from Legacy Fields

**Old code (still works):**
```typescript
if (result.cscaValidated) {
  console.log('Valid:', result.cscaValidationMessage);
}
```

**New code (recommended):**
```typescript
if (result.authenticationResult?.status === 'authentic') {
  console.log('Valid:', result.authenticationResult.message);
} else if (result.authenticationResult?.status === 'failed') {
  console.error('Failed:', result.authenticationResult.reason);
}
```

## Example App

A complete example app is included in the `example/` directory. To run it:

```bash
# Install dependencies
cd example
yarn install

# iOS
cd ios && pod install && cd ..
yarn ios

# Android
yarn android
```

The example app demonstrates:
- Passport reading with MRZ scanning
- ID card reading with CAN/PIN input
- OCR scanning for old cards
- License status display
- Authentication result handling (v1.4.7+)

## Requirements

### iOS
- iOS 15.0 or later
- NFC-capable device (iPhone 7 or later)
- Valid iOS Developer account (for NFC entitlement)

### Android
- Android API 28 (Pie) or later
- NFC-capable device
- Automatic NFC lifecycle management (v1.2.0+)

## License

This SDK is commercial software. A valid license key is required for use.

For licensing information, contact: **office@up2date.ro**

## Support

- **Email:** office@up2date.ro
- **Documentation:** [Full API Docs](https://docs.up2date.ro/romanian-eid-sdk)
- **Issues:** [GitHub Issues](https://github.com/up2datesoftware/RNRomanianEIDSDK/issues)

## Security & Privacy

- All NFC communication is encrypted (BAC/PACE protocols)
- No data is sent to external servers
- CSCA validation performed locally
- Biometric data never leaves the device
- License validation done via JWT

## Credits

Developed by [Up2Date Software](https://up2date.ro)

© 2025 Up2Date. All rights reserved.
