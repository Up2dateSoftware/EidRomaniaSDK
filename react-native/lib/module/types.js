/**
 * RomanianEIDSDK - TypeScript type definitions
 * Copyright © 2025 Up2Date. All rights reserved.
 */

// MARK: - Passport Result

// MARK: - Authentication Result (CSCA Validation)

/**
 * Authentication result from Passive Authentication (CSCA validation)
 *
 * This result indicates whether the electronic ID card is authentic
 * and if the data read has not been modified.
 *
 * Passive Authentication verifies:
 * 1. SOD (Security Object Document) signature with DS certificate
 * 2. Hashes of data read (DG1, DG2, etc.) vs. SOD
 * 3. Certificate chain CSCA → DS
 */

// MARK: - ID Card Result

// MARK: - MRZ Scan Result

// MARK: - OCR Scan Result

// MARK: - License Information

// MARK: - Read Options

// MARK: - Event Listeners

// MARK: - Error Codes

export let EIDErrorCode = /*#__PURE__*/function (EIDErrorCode) {
  // License errors
  EIDErrorCode["LICENSE_INVALID"] = "LICENSE_INVALID";
  EIDErrorCode["LICENSE_EXPIRED"] = "LICENSE_EXPIRED";
  EIDErrorCode["BUNDLE_ID_MISMATCH"] = "BUNDLE_ID_MISMATCH";
  EIDErrorCode["FEATURE_NOT_LICENSED"] = "FEATURE_NOT_LICENSED";
  // NFC errors
  EIDErrorCode["NFC_NOT_AVAILABLE"] = "NFC_NOT_AVAILABLE";
  EIDErrorCode["NFC_SESSION_FAILED"] = "NFC_SESSION_FAILED";
  EIDErrorCode["INVALID_MRZ"] = "INVALID_MRZ";
  EIDErrorCode["INVALID_CAN"] = "INVALID_CAN";
  EIDErrorCode["INVALID_PIN"] = "INVALID_PIN";
  EIDErrorCode["INVALID_TAG"] = "INVALID_TAG";
  EIDErrorCode["READ_TIMEOUT"] = "READ_TIMEOUT";
  EIDErrorCode["CONNECTION_LOST"] = "CONNECTION_LOST";
  EIDErrorCode["USER_CANCELLED"] = "USER_CANCELLED";
  // Validation errors
  EIDErrorCode["CSCA_VALIDATION_FAILED"] = "CSCA_VALIDATION_FAILED";
  EIDErrorCode["SIGNATURE_INVALID"] = "SIGNATURE_INVALID";
  // General errors
  EIDErrorCode["READ_FAILED"] = "READ_FAILED";
  EIDErrorCode["UNEXPECTED_ERROR"] = "UNEXPECTED_ERROR";
  EIDErrorCode["INIT_ERROR"] = "INIT_ERROR";
  EIDErrorCode["NO_VIEW_CONTROLLER"] = "NO_VIEW_CONTROLLER";
  EIDErrorCode["NO_LICENSE"] = "NO_LICENSE";
  return EIDErrorCode;
}({});
//# sourceMappingURL=types.js.map