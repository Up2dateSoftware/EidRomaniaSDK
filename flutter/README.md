# Romanian eID SDK for Flutter

Flutter plugin for reading Romanian electronic identity documents (passports and ID cards) via NFC.

## Features

- Read Romanian passports using BAC (Basic Access Control)
- Read Romanian ID cards using PACE (Password Authenticated Connection Establishment)
- MRZ (Machine Readable Zone) scanning via camera
- Real-time reading progress callbacks
- Cross-platform support (iOS and Android)

## Requirements

### iOS
- iOS 13.0 or later
- iPhone 7 or later (NFC capable devices)
- Xcode 15.0 or later

### Android
- Android API 24 (Android 7.0) or later
- NFC capable device

## Installation

Add to your `pubspec.yaml`:

```yaml
dependencies:
  romanian_eid_sdk: ^1.0.0
```

### iOS Setup

1. Add NFC capability to your app in Xcode:
   - Select your project target
   - Go to "Signing & Capabilities"
   - Click "+ Capability" and add "Near Field Communication Tag Reading"

2. Add required entries to your `Info.plist`:

```xml
<key>NFCReaderUsageDescription</key>
<string>This app uses NFC to read electronic identity documents.</string>
<key>com.apple.developer.nfc.readersession.iso7816.select-identifiers</key>
<array>
    <string>A0000002471001</string>
</array>
```

### Android Setup

Add NFC permissions to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.NFC" />
<uses-feature android:name="android.hardware.nfc" android:required="true" />
```

## Usage

### Initialize the SDK

```dart
import 'package:romanian_eid_sdk/romanian_eid_sdk.dart';

final sdk = RomanianEidSdk();

// Initialize with your license key
await sdk.initialize('your-license-key');

// Check if NFC is available
final nfcAvailable = await sdk.isNfcAvailable();
```

### Read Passport (BAC)

```dart
// Listen to progress updates
sdk.progressStream.listen((progress) {
  print('${progress.step}: ${progress.message} (${progress.progress * 100}%)');
});

// Read passport data
final passportData = await sdk.readPassport(
  documentNumber: '123456789',
  dateOfBirth: '901231',    // YYMMDD format
  dateOfExpiry: '301231',   // YYMMDD format
);

print('Name: ${passportData.firstName} ${passportData.lastName}');
print('Nationality: ${passportData.nationality}');
```

### Read ID Card (PACE)

```dart
// Read ID card using CAN (Card Access Number)
final idCardData = await sdk.readIDCard(can: '123456');

print('Name: ${idCardData.firstName} ${idCardData.lastName}');
print('CNP: ${idCardData.cnp}');
print('Address: ${idCardData.address}');
```

### Scan MRZ

```dart
// Open camera to scan MRZ
final mrzData = await sdk.scanMRZ();

if (mrzData != null) {
  // Use MRZ data for passport reading
  final passportData = await sdk.readPassport(
    documentNumber: mrzData.documentNumber,
    dateOfBirth: mrzData.dateOfBirth,
    dateOfExpiry: mrzData.dateOfExpiry,
  );
}
```

### Cancel Reading

```dart
// Cancel an ongoing reading operation
await sdk.cancelReading();
```

## Data Models

### PassportData

```dart
class PassportData {
  final String? firstName;
  final String? lastName;
  final String? documentNumber;
  final String? nationality;
  final String? dateOfBirth;
  final String? dateOfExpiry;
  final String? gender;
  final String? placeOfBirth;
  final String? issuingAuthority;
  final Uint8List? faceImage;
  final Uint8List? signatureImage;
}
```

### IDCardData

```dart
class IDCardData {
  final String? firstName;
  final String? lastName;
  final String? cnp;           // Romanian Personal Numerical Code
  final String? documentNumber;
  final String? address;
  final String? dateOfBirth;
  final String? dateOfExpiry;
  final String? gender;
  final String? placeOfBirth;
  final Uint8List? faceImage;
}
```

### ReadingProgress

```dart
class ReadingProgress {
  final String step;
  final String message;
  final double progress;  // 0.0 to 1.0
}
```

## Example

See the [example](example/) folder for a complete demo application.

## License

This SDK requires a valid license key for production use. Contact [support@eidromania.com](mailto:support@eidromania.com) for licensing information.

## Related SDKs

- [iOS SDK](https://github.com/up2datesoftware/eidromania-ios-sdk)
- [React Native SDK](https://github.com/up2datesoftware/eidromania-reactnative)
- [Windows SDK](https://github.com/up2datesoftware/eidromania-windows)
