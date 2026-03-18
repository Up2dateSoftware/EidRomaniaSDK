/**
 * Native module interface
 * Copyright © 2025 Up2Date. All rights reserved.
 */

import { NativeModules, NativeEventEmitter } from 'react-native';
import type {
  PassportResult,
  IDCardResult,
  MRZScanResult,
  OCRScanResult,
  LicenseInfo,
  PassportReadOptions,
  IDCardReadOptions,
} from './types';

const LINKING_ERROR =
  `The package 'react-native-romanian-eid-sdk' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n' +
  '- For iOS: Run `pod install` in the ios/ directory\n' +
  '- For Android: Rebuild the app';

const RomanianEIDSDK = NativeModules.RomanianEIDSDK
  ? NativeModules.RomanianEIDSDK
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const EventEmitter = new NativeEventEmitter(RomanianEIDSDK);

export interface NativeRomanianEIDSDK {
  initialize(license: string): Promise<boolean>;
  readPassport(mrzKey: string, options: PassportReadOptions): Promise<PassportResult>;
  readIDCard(can: string, pin: string, options: IDCardReadOptions): Promise<IDCardResult>;
  startMRZScanning(): Promise<MRZScanResult>;
  startOCRScanning(): Promise<OCRScanResult>;
  isNFCAvailable(): Promise<boolean>;
  getLicenseInfo(): Promise<LicenseInfo>;
}

export default RomanianEIDSDK as NativeRomanianEIDSDK;
