//
//  RNRomanianEIDSDK.m
//  RNRomanianEIDSDK
//
//  Objective-C macro file for React Native module registration
//  The actual implementation is in RNRomanianEIDSDK.swift
//  Copyright © 2025 Up2Date. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(RomanianEIDSDK, RCTEventEmitter)

RCT_EXTERN_METHOD(initialize:(NSString *)license
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(readPassport:(NSString *)mrzKey
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(readIDCard:(NSString *)can
                  pin:(NSString *)pin
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startMRZScanning:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startOCRScanning:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isNFCAvailable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getLicenseInfo:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
