/**
 * RomanianEIDSDK - TypeScript type definitions
 * Copyright © 2025 Up2Date. All rights reserved.
 */

// MARK: - Passport Result

export interface PassportResult {
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
  facialImageBase64?: string;
  signatureImageBase64?: string;
  cscaValidated: boolean;
  cscaCountry?: string;
  cscaValidationMessage?: string;
  errorMessage?: string;
}

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
export interface AuthenticationResult {
  /**
   * Status of authentication:
   * - "authentic": Card is authentic, all verifications passed
   * - "failed": Card is suspect or fake
   * - "warning": Partial verification (e.g. CSCA certificate not available)
   */
  status: 'authentic' | 'failed' | 'warning';

  /**
   * Human-readable message describing the result
   */
  message: string;

  /**
   * Reason for failure (only present when status is "failed")
   */
  reason?: string;

  /**
   * Additional details about the authentication result
   */
  details?: string;
}

// MARK: - ID Card Result

export interface IDCardResult {
  success: boolean;
  documentNumber: string;
  cnp: string;
  fullName: string;
  dateOfBirth: string;
  sex: string;
  dateOfExpiry: string;
  dateOfIssue?: string;
  issuingAuthority?: string;
  placeOfBirth?: string;
  citizenship?: string;
  address?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  foreignAddress?: string;
  facialImageBase64?: string;
  signatureImageBase64?: string;

  /**
   * Detailed authentication result from Passive Authentication (NEW in v1.5.3)
   * This provides detailed information about CSCA validation
   */
  authenticationResult?: AuthenticationResult;

  /**
   * @deprecated Use authenticationResult.status === 'authentic' instead
   * Legacy field for backward compatibility
   */
  cscaValidated: boolean;

  /**
   * @deprecated Use authenticationResult.details instead
   * Legacy field for backward compatibility
   */
  cscaCountry?: string;

  /**
   * @deprecated Use authenticationResult.message instead
   * Legacy field for backward compatibility
   */
  cscaValidationMessage?: string;

  errorMessage?: string;
}

// MARK: - MRZ Scan Result

export interface MRZScanResult {
  documentType: string;
  issuingCountry: string;
  documentNumber: string;
  surname: string;
  givenNames: string;
  nationality: string;
  sex: string;
  dateOfBirth: string;
  dateOfExpiry: string;
  personalNumber?: string;
  fullMRZ: string;
  mrzKey: string;
}

// MARK: - OCR Scan Result

export interface OCRScanResult {
  success: boolean;
  documentNumber?: string;
  cnp?: string;
  fullName?: string;
  surname?: string;
  givenNames?: string;
  dateOfBirth?: string;
  sex?: string;
  nationality?: string;
  placeOfBirth?: string;
  permanentAddress?: string;
  issuingAuthority?: string;
  dateOfIssue?: string;
  dateOfExpiry?: string;
  facePhotoBase64?: string;
  confidence: number;
  isReliable: boolean;
  rawText: string;
  validationIssues: string[];
  errorMessage?: string;
}

// MARK: - License Information

export interface LicenseInfo {
  isValid: boolean;
  issuedTo: string;
  expiresAt: string;
  features: LicenseFeature[];
  tier: LicenseTier;
}

export type LicenseFeature =
  | 'passportReading'
  | 'idCardReading'
  | 'ocrScanning'
  | 'cscaValidation'
  | 'biometricExtraction'
  | 'advancedSecurity';

export type LicenseTier = 'trial' | 'commercial' | 'development' | 'basic' | 'pro' | 'enterprise';

// MARK: - Read Options

export interface PassportReadOptions {
  enableCSCAValidation?: boolean;
  timeout?: number;
}

export interface IDCardReadOptions {
  enableCSCAValidation?: boolean;
  readPhoto?: boolean;
  readSignature?: boolean;
  timeout?: number;
}

// MARK: - Event Listeners

export interface ReadProgressEvent {
  percentage: number;
  message: string;
}

export interface ReadCompleteEvent {
  result: PassportResult | IDCardResult;
}

export interface ReadErrorEvent {
  code: string;
  message: string;
}

// MARK: - Error Codes

export enum EIDErrorCode {
  // License errors
  LICENSE_INVALID = 'LICENSE_INVALID',
  LICENSE_EXPIRED = 'LICENSE_EXPIRED',
  BUNDLE_ID_MISMATCH = 'BUNDLE_ID_MISMATCH',
  FEATURE_NOT_LICENSED = 'FEATURE_NOT_LICENSED',

  // NFC errors
  NFC_NOT_AVAILABLE = 'NFC_NOT_AVAILABLE',
  NFC_SESSION_FAILED = 'NFC_SESSION_FAILED',
  INVALID_MRZ = 'INVALID_MRZ',
  INVALID_CAN = 'INVALID_CAN',
  INVALID_PIN = 'INVALID_PIN',
  INVALID_TAG = 'INVALID_TAG',
  READ_TIMEOUT = 'READ_TIMEOUT',
  CONNECTION_LOST = 'CONNECTION_LOST',
  USER_CANCELLED = 'USER_CANCELLED',

  // Validation errors
  CSCA_VALIDATION_FAILED = 'CSCA_VALIDATION_FAILED',
  SIGNATURE_INVALID = 'SIGNATURE_INVALID',

  // General errors
  READ_FAILED = 'READ_FAILED',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  INIT_ERROR = 'INIT_ERROR',
  NO_VIEW_CONTROLLER = 'NO_VIEW_CONTROLLER',
  NO_LICENSE = 'NO_LICENSE',
}
