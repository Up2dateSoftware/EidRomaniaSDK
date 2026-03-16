"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _NativeRomanianEIDSDK = _interopRequireWildcard(require("./NativeRomanianEIDSDK"));
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * RomanianEIDSDK - React Native wrapper
 * Copyright © 2025 Up2Date. All rights reserved.
 */

/**
 * Romanian eID SDK for React Native
 *
 * This SDK provides functionality to read Romanian electronic identity documents:
 * - Electronic Passports (ePassport) using BAC/PACE protocols
 * - Electronic ID Cards (Carte de Identitate Electronică) using PACE
 * - OCR scanning for old non-NFC ID cards
 *
 * ## Features
 * - NFC-based document reading
 * - CSCA certificate validation
 * - Biometric data extraction (photo, signature)
 * - Secure license management
 * - ICAO 9303 compliant
 *
 * @example
 * ```typescript
 * import EIDReader from 'react-native-romanian-eid-sdk';
 *
 * // Initialize SDK
 * await EIDReader.initialize(LICENSE_KEY);
 *
 * // Read passport
 * const result = await EIDReader.readPassport('RO123456789012345678');
 * console.log('Name:', result.fullName);
 * ```
 */
class EIDReader {
  static listeners = [];

  /**
   * Initialize SDK with license key
   *
   * Must be called before using any other SDK methods.
   *
   * @param license - Your SDK license key (JWT format)
   * @returns Promise that resolves to true if initialization successful
   * @throws Error if license is invalid or expired
   *
   * @example
   * ```typescript
   * try {
   *   await EIDReader.initialize('eyJhbGciOiJIUzI1NiIs...');
   *   console.log('SDK initialized');
   * } catch (error) {
   *   console.error('Failed to initialize:', error);
   * }
   * ```
   */
  static async initialize(license) {
    return _NativeRomanianEIDSDK.default.initialize(license);
  }

  /**
   * Read Romanian electronic passport via NFC
   *
   * @param mrzKey - Machine Readable Zone key (format: DocumentNumber+DOB+Expiry with check digits)
   * @param options - Optional reading configuration
   * @returns Promise with passport data
   * @throws Error if reading fails
   *
   * @example
   * ```typescript
   * const result = await EIDReader.readPassport(
   *   'RO123456789012345678',
   *   { enableCSCAValidation: true, timeout: 60 }
   * );
   * console.log('Passport:', result.documentNumber);
   * console.log('Name:', result.fullName);
   * ```
   */
  static async readPassport(mrzKey, options = {}) {
    return _NativeRomanianEIDSDK.default.readPassport(mrzKey, options);
  }

  /**
   * Read Romanian electronic ID card via NFC
   *
   * @param can - Card Access Number (6 digits printed on the card)
   * @param pin - Personal PIN (4-8 digits)
   * @param options - Optional reading configuration
   * @returns Promise with ID card data
   * @throws Error if reading fails
   *
   * @example
   * ```typescript
   * const result = await EIDReader.readIDCard(
   *   '123456',
   *   '1234',
   *   { readPhoto: true, readSignature: true }
   * );
   * console.log('CNP:', result.cnp);
   * console.log('Name:', result.fullName);
   * ```
   */
  static async readIDCard(can, pin, options = {}) {
    return _NativeRomanianEIDSDK.default.readIDCard(can, pin, options);
  }

  /**
   * Start MRZ scanning with camera
   *
   * Opens camera view to scan the MRZ (Machine Readable Zone) from a passport.
   *
   * @returns Promise with scanned MRZ data
   * @throws Error if scanning fails or user cancels
   *
   * @example
   * ```typescript
   * const mrzResult = await EIDReader.startMRZScanning();
   * console.log('MRZ Key:', mrzResult.mrzKey);
   * console.log('Name:', mrzResult.givenNames, mrzResult.surname);
   *
   * // Use MRZ key for NFC reading
   * const passportResult = await EIDReader.readPassport(mrzResult.mrzKey);
   * ```
   */
  static async startMRZScanning() {
    return _NativeRomanianEIDSDK.default.startMRZScanning();
  }

  /**
   * Start OCR scanning with camera
   *
   * Opens camera view to scan an old Romanian ID card (without NFC).
   * Uses computer vision to extract text data from the card photo.
   *
   * @returns Promise with extracted ID card data
   * @throws Error if scanning fails or user cancels
   *
   * @example
   * ```typescript
   * const ocrResult = await EIDReader.startOCRScanning();
   *
   * if (ocrResult.isReliable) {
   *   console.log('CNP:', ocrResult.cnp);
   *   console.log('Name:', ocrResult.fullName);
   * } else {
   *   console.warn('Low confidence:', ocrResult.validationIssues);
   * }
   * ```
   */
  static async startOCRScanning() {
    return _NativeRomanianEIDSDK.default.startOCRScanning();
  }

  /**
   * Check if NFC is available and SDK is ready
   *
   * @returns Promise that resolves to true if NFC is available and SDK initialized
   *
   * @example
   * ```typescript
   * const available = await EIDReader.isNFCAvailable();
   * if (!available) {
   *   Alert.alert('Error', 'NFC not available on this device');
   * }
   * ```
   */
  static async isNFCAvailable() {
    return _NativeRomanianEIDSDK.default.isNFCAvailable();
  }

  /**
   * Get current license information
   *
   * @returns Promise with license details
   * @throws Error if no license initialized
   *
   * @example
   * ```typescript
   * const info = await EIDReader.getLicenseInfo();
   * console.log('Valid:', info.isValid);
   * console.log('Expires:', info.expiresAt);
   * console.log('Features:', info.features);
   * ```
   */
  static async getLicenseInfo() {
    return _NativeRomanianEIDSDK.default.getLicenseInfo();
  }

  /**
   * Add event listener for reading progress updates
   *
   * @param callback - Function to call with progress updates
   * @returns Subscription object (call .remove() to unsubscribe)
   *
   * @example
   * ```typescript
   * const subscription = EIDReader.onReadProgress((event) => {
   *   console.log(`Progress: ${event.percentage}% - ${event.message}`);
   * });
   *
   * // Later, unsubscribe
   * subscription.remove();
   * ```
   */
  static onReadProgress(callback) {
    const subscription = _NativeRomanianEIDSDK.EventEmitter.addListener('onReadProgress', callback);
    this.listeners.push(subscription);
    return subscription;
  }

  /**
   * Add event listener for reading completion
   *
   * @param callback - Function to call when reading completes
   * @returns Subscription object
   *
   * @example
   * ```typescript
   * const subscription = EIDReader.onReadComplete((event) => {
   *   console.log('Reading complete:', event.result);
   * });
   * ```
   */
  static onReadComplete(callback) {
    const subscription = _NativeRomanianEIDSDK.EventEmitter.addListener('onReadComplete', callback);
    this.listeners.push(subscription);
    return subscription;
  }

  /**
   * Add event listener for reading errors
   *
   * @param callback - Function to call on error
   * @returns Subscription object
   *
   * @example
   * ```typescript
   * const subscription = EIDReader.onReadError((event) => {
   *   console.error('Reading failed:', event.code, event.message);
   * });
   * ```
   */
  static onReadError(callback) {
    const subscription = _NativeRomanianEIDSDK.EventEmitter.addListener('onReadError', callback);
    this.listeners.push(subscription);
    return subscription;
  }

  /**
   * Remove all event listeners
   *
   * Should be called when component unmounts to prevent memory leaks.
   *
   * @example
   * ```typescript
   * useEffect(() => {
   *   EIDReader.onReadProgress(handleProgress);
   *
   *   return () => {
   *     EIDReader.removeAllListeners();
   *   };
   * }, []);
   * ```
   */
  static removeAllListeners() {
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
  }

  /**
   * SDK version
   */
  static version = '1.0.0';
}
var _default = exports.default = EIDReader;
//# sourceMappingURL=index.js.map