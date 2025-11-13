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

// MARK: - ID Card Result

export interface IDCardResult {
  success: boolean;
  documentNumber: string;
  cnp: string;
  fullName: string;
  dateOfBirth: string;
  sex: string;
  dateOfExpiry: string;
  issuingAuthority?: string;
  placeOfBirth?: string;
  citizenship?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  foreignAddress?: string;
  facialImageBase64?: string;
  signatureImageBase64?: string;
  cscaValidated: boolean;
  cscaCountry?: string;
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
