"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EventEmitter = void 0;
var _reactNative = require("react-native");
/**
 * Native module interface
 * Copyright © 2025 Up2Date. All rights reserved.
 */

const LINKING_ERROR = `The package 'react-native-romanian-eid-sdk' doesn't seem to be linked. Make sure: \n\n` + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n' + '- For iOS: Run `pod install` in the ios/ directory\n' + '- For Android: Rebuild the app';
const RomanianEIDSDK = _reactNative.NativeModules.RomanianEIDSDK ? _reactNative.NativeModules.RomanianEIDSDK : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
const EventEmitter = exports.EventEmitter = new _reactNative.NativeEventEmitter(RomanianEIDSDK);
var _default = exports.default = RomanianEIDSDK;
//# sourceMappingURL=NativeRomanianEIDSDK.js.map