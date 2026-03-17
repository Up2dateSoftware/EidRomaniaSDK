import Flutter
import UIKit

public class RomanianEidSdkPlugin: NSObject, FlutterPlugin {
    private var channel: FlutterMethodChannel?
    private var eventChannel: FlutterEventChannel?
    private var eventSink: FlutterEventSink?

    // TODO: Import RomanianEIDSDK when available
    // import RomanianEIDSDK

    public static func register(with registrar: FlutterPluginRegistrar) {
        let instance = RomanianEidSdkPlugin()

        let channel = FlutterMethodChannel(name: "romanian_eid_sdk", binaryMessenger: registrar.messenger())
        instance.channel = channel
        registrar.addMethodCallDelegate(instance, channel: channel)

        let eventChannel = FlutterEventChannel(name: "romanian_eid_sdk/progress", binaryMessenger: registrar.messenger())
        instance.eventChannel = eventChannel
        eventChannel.setStreamHandler(instance)
    }

    public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        switch call.method {
        case "initialize":
            handleInitialize(call, result: result)
        case "isInitialized":
            handleIsInitialized(result: result)
        case "isNfcAvailable":
            handleIsNfcAvailable(result: result)
        case "readPassport":
            handleReadPassport(call, result: result)
        case "readIDCard":
            handleReadIDCard(call, result: result)
        case "scanMRZ":
            handleScanMRZ(result: result)
        case "cancelReading":
            handleCancelReading(result: result)
        default:
            result(FlutterMethodNotImplemented)
        }
    }

    // MARK: - Method Handlers

    private func handleInitialize(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        guard let args = call.arguments as? [String: Any],
              let licenseKey = args["licenseKey"] as? String else {
            result(FlutterError(code: "INVALID_ARGUMENTS", message: "License key required", details: nil))
            return
        }

        // TODO: Initialize with actual SDK
        // RomanianEIDSDK.shared.initialize(licenseKey: licenseKey) { success, error in
        //     if let error = error {
        //         result(FlutterError(code: "INIT_ERROR", message: error.localizedDescription, details: nil))
        //     } else {
        //         result(success)
        //     }
        // }

        // Placeholder
        result(true)
    }

    private func handleIsInitialized(result: @escaping FlutterResult) {
        // TODO: Check actual SDK initialization status
        // result(RomanianEIDSDK.shared.isInitialized)
        result(false)
    }

    private func handleIsNfcAvailable(result: @escaping FlutterResult) {
        if #available(iOS 13.0, *) {
            // TODO: Use actual SDK check
            // result(RomanianEIDSDK.shared.isNFCAvailable)
            result(true)
        } else {
            result(false)
        }
    }

    private func handleReadPassport(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        guard let args = call.arguments as? [String: Any],
              let documentNumber = args["documentNumber"] as? String,
              let dateOfBirth = args["dateOfBirth"] as? String,
              let dateOfExpiry = args["dateOfExpiry"] as? String else {
            result(FlutterError(code: "INVALID_ARGUMENTS", message: "Document number, date of birth, and date of expiry required", details: nil))
            return
        }

        // TODO: Implement actual passport reading
        // RomanianEIDSDK.shared.readPassport(
        //     documentNumber: documentNumber,
        //     dateOfBirth: dateOfBirth,
        //     dateOfExpiry: dateOfExpiry,
        //     progressHandler: { progress in
        //         self.sendProgress(progress)
        //     },
        //     completionHandler: { passportData, error in
        //         if let error = error {
        //             result(FlutterError(code: "READ_ERROR", message: error.localizedDescription, details: nil))
        //         } else if let data = passportData {
        //             result(self.passportDataToMap(data))
        //         }
        //     }
        // )

        result(FlutterError(code: "NOT_IMPLEMENTED", message: "SDK not integrated yet", details: nil))
    }

    private func handleReadIDCard(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        guard let args = call.arguments as? [String: Any],
              let can = args["can"] as? String else {
            result(FlutterError(code: "INVALID_ARGUMENTS", message: "CAN required", details: nil))
            return
        }

        // TODO: Implement actual ID card reading
        // RomanianEIDSDK.shared.readIDCard(
        //     can: can,
        //     progressHandler: { progress in
        //         self.sendProgress(progress)
        //     },
        //     completionHandler: { idCardData, error in
        //         if let error = error {
        //             result(FlutterError(code: "READ_ERROR", message: error.localizedDescription, details: nil))
        //         } else if let data = idCardData {
        //             result(self.idCardDataToMap(data))
        //         }
        //     }
        // )

        result(FlutterError(code: "NOT_IMPLEMENTED", message: "SDK not integrated yet", details: nil))
    }

    private func handleScanMRZ(result: @escaping FlutterResult) {
        // TODO: Implement MRZ scanning
        result(FlutterError(code: "NOT_IMPLEMENTED", message: "MRZ scanning not implemented yet", details: nil))
    }

    private func handleCancelReading(result: @escaping FlutterResult) {
        // TODO: Cancel ongoing reading
        // RomanianEIDSDK.shared.cancelReading()
        result(nil)
    }

    // MARK: - Helper Methods

    private func sendProgress(_ progress: [String: Any]) {
        DispatchQueue.main.async {
            self.eventSink?(progress)
        }
    }
}

// MARK: - FlutterStreamHandler

extension RomanianEidSdkPlugin: FlutterStreamHandler {
    public func onListen(withArguments arguments: Any?, eventSink events: @escaping FlutterEventSink) -> FlutterError? {
        self.eventSink = events
        return nil
    }

    public func onCancel(withArguments arguments: Any?) -> FlutterError? {
        self.eventSink = nil
        return nil
    }
}
