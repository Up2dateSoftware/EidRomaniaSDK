//
//  RNRomanianEIDSDK.m
//  RNRomanianEIDSDK
//
//  React Native bridge implementation
//  Copyright © 2025 Up2Date. All rights reserved.
//

#import "RNRomanianEIDSDK.h"
#import <React/RCTLog.h>

@implementation RNRomanianEIDSDK

RCT_EXPORT_MODULE(RomanianEIDSDK);

// Events that can be sent to JavaScript
- (NSArray<NSString *> *)supportedEvents {
    return @[@"onReadProgress", @"onReadComplete", @"onReadError"];
}

// Initialize SDK with license
RCT_EXPORT_METHOD(initialize:(NSString *)license
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [RNRomanianEIDSDKBridge initializeWithLicense:license
                                         resolver:resolve
                                         rejecter:reject];
}

// Read passport via NFC
RCT_EXPORT_METHOD(readPassport:(NSString *)mrzKey
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [RNRomanianEIDSDKBridge readPassportWithMrzKey:mrzKey
                                           options:options
                                          resolver:resolve
                                          rejecter:reject];
}

// Read ID card via NFC
RCT_EXPORT_METHOD(readIDCard:(NSString *)can
                  pin:(NSString *)pin
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [RNRomanianEIDSDKBridge readIDCardWithCan:can
                                          pin:pin
                                      options:options
                                     resolver:resolve
                                     rejecter:reject];
}

// Start MRZ scanning with camera
RCT_EXPORT_METHOD(startMRZScanning:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [RNRomanianEIDSDKBridge startMRZScanningWithResolver:resolve
                                                rejecter:reject];
}

// Start OCR scanning with camera
RCT_EXPORT_METHOD(startOCRScanning:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [RNRomanianEIDSDKBridge startOCRScanningWithResolver:resolve
                                                rejecter:reject];
}

// Check if NFC is available
RCT_EXPORT_METHOD(isNFCAvailable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [RNRomanianEIDSDKBridge isNFCAvailableWithResolver:resolve
                                              rejecter:reject];
}

// Get license information
RCT_EXPORT_METHOD(getLicenseInfo:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [RNRomanianEIDSDKBridge getLicenseInfoWithResolver:resolve
                                              rejecter:reject];
}

// Send event to JavaScript
+ (void)sendEventWithName:(NSString *)eventName body:(NSDictionary *)body {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"RNRomanianEIDSDKEvent"
                                                        object:nil
                                                      userInfo:@{@"eventName": eventName, @"body": body}];
}

- (void)startObserving {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleEvent:)
                                                 name:@"RNRomanianEIDSDKEvent"
                                               object:nil];
}

- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)handleEvent:(NSNotification *)notification {
    NSString *eventName = notification.userInfo[@"eventName"];
    NSDictionary *body = notification.userInfo[@"body"];
    [self sendEventWithName:eventName body:body];
}

@end
