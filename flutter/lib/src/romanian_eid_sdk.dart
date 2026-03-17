import 'dart:async';
import 'package:flutter/services.dart';
import 'models.dart';

/// Main class for interacting with Romanian eID documents.
class RomanianEidSdk {
  static const MethodChannel _channel = MethodChannel('romanian_eid_sdk');
  static const EventChannel _progressChannel =
      EventChannel('romanian_eid_sdk/progress');

  /// Initialize the SDK with a license key.
  ///
  /// Must be called before any other SDK methods.
  static Future<bool> initialize(String licenseKey) async {
    final result = await _channel.invokeMethod<bool>('initialize', {
      'licenseKey': licenseKey,
    });
    return result ?? false;
  }

  /// Check if the SDK is properly initialized and licensed.
  static Future<bool> isInitialized() async {
    final result = await _channel.invokeMethod<bool>('isInitialized');
    return result ?? false;
  }

  /// Check if NFC is available on this device.
  static Future<bool> isNfcAvailable() async {
    final result = await _channel.invokeMethod<bool>('isNfcAvailable');
    return result ?? false;
  }

  /// Read a passport using BAC (Basic Access Control) protocol.
  ///
  /// Requires MRZ data: document number, date of birth, and expiry date.
  /// All dates should be in YYMMDD format.
  static Future<PassportData> readPassport({
    required String documentNumber,
    required String dateOfBirth,
    required String dateOfExpiry,
  }) async {
    final result = await _channel.invokeMethod<Map>('readPassport', {
      'documentNumber': documentNumber,
      'dateOfBirth': dateOfBirth,
      'dateOfExpiry': dateOfExpiry,
    });

    if (result == null) {
      throw PlatformException(
        code: 'READ_ERROR',
        message: 'Failed to read passport data',
      );
    }

    return PassportData.fromMap(Map<String, dynamic>.from(result));
  }

  /// Read an ID card using PACE protocol with CAN.
  ///
  /// The CAN (Card Access Number) is printed on the front of the ID card.
  static Future<IDCardData> readIDCard({
    required String can,
  }) async {
    final result = await _channel.invokeMethod<Map>('readIDCard', {
      'can': can,
    });

    if (result == null) {
      throw PlatformException(
        code: 'READ_ERROR',
        message: 'Failed to read ID card data',
      );
    }

    return IDCardData.fromMap(Map<String, dynamic>.from(result));
  }

  /// Scan MRZ using device camera.
  ///
  /// Returns the extracted MRZ data that can be used with [readPassport].
  static Future<MRZData> scanMRZ() async {
    final result = await _channel.invokeMethod<Map>('scanMRZ');

    if (result == null) {
      throw PlatformException(
        code: 'SCAN_ERROR',
        message: 'Failed to scan MRZ',
      );
    }

    return MRZData.fromMap(Map<String, dynamic>.from(result));
  }

  /// Stream of reading progress updates.
  ///
  /// Listen to this stream to show progress UI during document reading.
  static Stream<ReadingProgress> get progressStream {
    return _progressChannel.receiveBroadcastStream().map((event) {
      return ReadingProgress.fromMap(Map<String, dynamic>.from(event));
    });
  }

  /// Cancel any ongoing reading operation.
  static Future<void> cancelReading() async {
    await _channel.invokeMethod('cancelReading');
  }
}
