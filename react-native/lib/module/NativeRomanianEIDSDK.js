/**
 * Native module interface
 * Copyright © 2025 Up2Date. All rights reserved.
 */

import { NativeModules, NativeEventEmitter } from 'react-native';
const LINKING_ERROR = `The package 'react-native-romanian-eid-sdk' doesn't seem to be linked. Make sure: \n\n` + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n' + '- For iOS: Run `pod install` in the ios/ directory\n' + '- For Android: Rebuild the app';
const RomanianEIDSDK = NativeModules.RomanianEIDSDK ? NativeModules.RomanianEIDSDK : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
export const EventEmitter = new NativeEventEmitter(RomanianEIDSDK);
export default RomanianEIDSDK;
//# sourceMappingURL=NativeRomanianEIDSDK.js.map