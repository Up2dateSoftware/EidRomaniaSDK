/**
 * Native module interface
 * Copyright © 2025 Up2Date. All rights reserved.
 */
import { NativeEventEmitter } from 'react-native';
import type { PassportResult, IDCardResult, MRZScanResult, OCRScanResult, LicenseInfo, PassportReadOptions, IDCardReadOptions } from './types';
export declare const EventEmitter: NativeEventEmitter;
export interface NativeRomanianEIDSDK {
    initialize(license: string): Promise<boolean>;
    readPassport(mrzKey: string, options: PassportReadOptions): Promise<PassportResult>;
    readIDCard(can: string, pin: string, options: IDCardReadOptions): Promise<IDCardResult>;
    startMRZScanning(): Promise<MRZScanResult>;
    startOCRScanning(): Promise<OCRScanResult>;
    isNFCAvailable(): Promise<boolean>;
    getLicenseInfo(): Promise<LicenseInfo>;
}
declare const _default: NativeRomanianEIDSDK;
export default _default;
//# sourceMappingURL=NativeRomanianEIDSDK.d.ts.map