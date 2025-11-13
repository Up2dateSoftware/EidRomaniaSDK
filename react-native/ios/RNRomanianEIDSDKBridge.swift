//
//  RNRomanianEIDSDKBridge.swift
//  RNRomanianEIDSDK
//
//  Swift implementation of React Native bridge over RomanianEIDSDK
//  Copyright © 2025 Up2Date. All rights reserved.
//

import Foundation
import UIKit
import RomanianEIDSDK

@objc(RNRomanianEIDSDKBridge)
class RNRomanianEIDSDKBridge: NSObject {

    // MARK: - Initialize SDK

    @objc static func initialize(
        license: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            try EIDLicenseManager.shared.initialize(licenseKey: license)
            resolve(true)
        } catch {
            reject("INIT_ERROR", "Failed to initialize SDK: \(error.localizedDescription)", error)
        }
    }

    // MARK: - Read Passport

    @objc static func readPassport(
        mrzKey: String,
        options: NSDictionary,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                // Parse options
                let readOptions = parsePassportOptions(options)

                // Read passport
                let result = try await EIDReader.shared.readPassport(
                    mrzKey: mrzKey,
                    options: readOptions
                )

                // Convert to JSON
                let jsonDict = passportResultToJSON(result)
                resolve(jsonDict)
            } catch let error as EIDError {
                reject("READ_PASSPORT_ERROR", error.localizedDescription, error)
            } catch {
                reject("READ_PASSPORT_ERROR", "Unexpected error: \(error.localizedDescription)", error)
            }
        }
    }

    // MARK: - Read ID Card

    @objc static func readIDCard(
        can: String,
        pin: String,
        options: NSDictionary,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                // Parse options
                let readOptions = parseIDCardOptions(options)

                // Read ID card
                let result = try await EIDReader.shared.readIDCard(
                    can: can,
                    pin: pin,
                    options: readOptions
                )

                // Convert to JSON
                let jsonDict = idCardResultToJSON(result)
                resolve(jsonDict)
            } catch let error as EIDError {
                reject("READ_IDCARD_ERROR", error.localizedDescription, error)
            } catch {
                reject("READ_IDCARD_ERROR", "Unexpected error: \(error.localizedDescription)", error)
            }
        }
    }

    // MARK: - Start MRZ Scanning

    @objc static func startMRZScanning(
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.main.async {
            guard let rootVC = UIApplication.shared.keyWindow?.rootViewController else {
                reject("NO_VIEW_CONTROLLER", "Cannot find root view controller", nil)
                return
            }

            // Get the topmost view controller
            var topVC = rootVC
            while let presented = topVC.presentedViewController {
                topVC = presented
            }

            Task {
                do {
                    let result = try await EIDReader.shared.startMRZScanning(from: topVC)
                    let jsonDict = mrzResultToJSON(result)
                    resolve(jsonDict)
                } catch let error as EIDError {
                    reject("MRZ_SCAN_ERROR", error.localizedDescription, error)
                } catch {
                    reject("MRZ_SCAN_ERROR", "Unexpected error: \(error.localizedDescription)", error)
                }
            }
        }
    }

    // MARK: - Start OCR Scanning

    @objc static func startOCRScanning(
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.main.async {
            guard let rootVC = UIApplication.shared.keyWindow?.rootViewController else {
                reject("NO_VIEW_CONTROLLER", "Cannot find root view controller", nil)
                return
            }

            // Get the topmost view controller
            var topVC = rootVC
            while let presented = topVC.presentedViewController {
                topVC = presented
            }

            Task {
                do {
                    let result = try await EIDReader.shared.startOCRScanning(from: topVC)
                    let jsonDict = ocrResultToJSON(result)
                    resolve(jsonDict)
                } catch let error as EIDError {
                    reject("OCR_SCAN_ERROR", error.localizedDescription, error)
                } catch {
                    reject("OCR_SCAN_ERROR", "Unexpected error: \(error.localizedDescription)", error)
                }
            }
        }
    }

    // MARK: - Check NFC Availability

    @objc static func isNFCAvailable(
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        let available = EIDReader.shared.isReady
        resolve(available)
    }

    // MARK: - Get License Info

    @objc static func getLicenseInfo(
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let licenseInfo = EIDLicenseManager.shared.licenseInfo else {
            reject("NO_LICENSE", "No license initialized", nil)
            return
        }

        let info: [String: Any] = [
            "isValid": EIDLicenseManager.shared.isValid,
            "issuedTo": licenseInfo.issuedTo,
            "expiresAt": ISO8601DateFormatter().string(from: licenseInfo.expiresAt),
            "features": licenseInfo.features.map { $0.rawValue },
            "tier": licenseInfo.tier.rawValue
        ]

        resolve(info)
    }

    // MARK: - Helper Methods: Option Parsing

    private static func parsePassportOptions(_ options: NSDictionary) -> PassportReadOptions {
        let enableCSCAValidation = options["enableCSCAValidation"] as? Bool ?? true
        let timeout = options["timeout"] as? TimeInterval ?? 60

        return PassportReadOptions(
            enableCSCAValidation: enableCSCAValidation,
            timeout: timeout
        )
    }

    private static func parseIDCardOptions(_ options: NSDictionary) -> IDCardReadOptions {
        let enableCSCAValidation = options["enableCSCAValidation"] as? Bool ?? true
        let readPhoto = options["readPhoto"] as? Bool ?? true
        let readSignature = options["readSignature"] as? Bool ?? true
        let timeout = options["timeout"] as? TimeInterval ?? 90

        return IDCardReadOptions(
            enableCSCAValidation: enableCSCAValidation,
            readPhoto: readPhoto,
            readSignature: readSignature,
            timeout: timeout
        )
    }

    // MARK: - Helper Methods: Result to JSON Conversion

    private static func passportResultToJSON(_ result: PassportResult) -> [String: Any] {
        var dict: [String: Any] = [
            "success": result.success,
            "documentNumber": result.documentNumber,
            "fullName": result.fullName,
            "dateOfBirth": result.dateOfBirth,
            "nationality": result.nationality,
            "sex": result.sex,
            "dateOfExpiry": result.dateOfExpiry,
            "cscaValidated": result.cscaValidated
        ]

        if let cnp = result.cnp { dict["cnp"] = cnp }
        if let placeOfBirth = result.placeOfBirth { dict["placeOfBirth"] = placeOfBirth }
        if let residenceAddress = result.residenceAddress { dict["residenceAddress"] = residenceAddress }
        if let phoneNumber = result.phoneNumber { dict["phoneNumber"] = phoneNumber }
        if let cscaCountry = result.cscaCountry { dict["cscaCountry"] = cscaCountry }
        if let cscaValidationMessage = result.cscaValidationMessage { dict["cscaValidationMessage"] = cscaValidationMessage }
        if let errorMessage = result.errorMessage { dict["errorMessage"] = errorMessage }

        // Convert images to base64
        if let facialImage = result.facialImage,
           let imageData = facialImage.jpegData(compressionQuality: 0.8) {
            dict["facialImageBase64"] = imageData.base64EncodedString()
        }

        if let signatureImage = result.signatureImage,
           let imageData = signatureImage.pngData() {
            dict["signatureImageBase64"] = imageData.base64EncodedString()
        }

        return dict
    }

    private static func idCardResultToJSON(_ result: IDCardResult) -> [String: Any] {
        var dict: [String: Any] = [
            "success": result.success,
            "documentNumber": result.documentNumber,
            "cnp": result.cnp,
            "fullName": result.fullName,
            "dateOfBirth": result.dateOfBirth,
            "sex": result.sex,
            "dateOfExpiry": result.dateOfExpiry,
            "cscaValidated": result.cscaValidated
        ]

        if let issuingAuthority = result.issuingAuthority { dict["issuingAuthority"] = issuingAuthority }
        if let placeOfBirth = result.placeOfBirth { dict["placeOfBirth"] = placeOfBirth }
        if let citizenship = result.citizenship { dict["citizenship"] = citizenship }
        if let permanentAddress = result.permanentAddress { dict["permanentAddress"] = permanentAddress }
        if let temporaryAddress = result.temporaryAddress { dict["temporaryAddress"] = temporaryAddress }
        if let foreignAddress = result.foreignAddress { dict["foreignAddress"] = foreignAddress }
        if let cscaCountry = result.cscaCountry { dict["cscaCountry"] = cscaCountry }
        if let cscaValidationMessage = result.cscaValidationMessage { dict["cscaValidationMessage"] = cscaValidationMessage }
        if let errorMessage = result.errorMessage { dict["errorMessage"] = errorMessage }

        // Convert images to base64
        if let facialImage = result.facialImage,
           let imageData = facialImage.jpegData(compressionQuality: 0.8) {
            dict["facialImageBase64"] = imageData.base64EncodedString()
        }

        if let signatureImage = result.signatureImage,
           let imageData = signatureImage.pngData() {
            dict["signatureImageBase64"] = imageData.base64EncodedString()
        }

        return dict
    }

    private static func mrzResultToJSON(_ result: MRZScanResult) -> [String: Any] {
        var dict: [String: Any] = [
            "documentType": result.documentType,
            "issuingCountry": result.issuingCountry,
            "documentNumber": result.documentNumber,
            "surname": result.surname,
            "givenNames": result.givenNames,
            "nationality": result.nationality,
            "sex": result.sex,
            "dateOfBirth": result.dateOfBirth,
            "dateOfExpiry": result.dateOfExpiry,
            "fullMRZ": result.fullMRZ,
            "mrzKey": result.mrzKey
        ]

        if let personalNumber = result.personalNumber {
            dict["personalNumber"] = personalNumber
        }

        return dict
    }

    private static func ocrResultToJSON(_ result: OCRScanResult) -> [String: Any] {
        var dict: [String: Any] = [
            "success": result.success,
            "confidence": result.confidence,
            "isReliable": result.isReliable,
            "rawText": result.rawText,
            "validationIssues": result.validationIssues
        ]

        if let documentNumber = result.documentNumber { dict["documentNumber"] = documentNumber }
        if let cnp = result.cnp { dict["cnp"] = cnp }
        if let fullName = result.fullName { dict["fullName"] = fullName }
        if let surname = result.surname { dict["surname"] = surname }
        if let givenNames = result.givenNames { dict["givenNames"] = givenNames }
        if let dateOfBirth = result.dateOfBirth { dict["dateOfBirth"] = dateOfBirth }
        if let sex = result.sex { dict["sex"] = sex }
        if let nationality = result.nationality { dict["nationality"] = nationality }
        if let placeOfBirth = result.placeOfBirth { dict["placeOfBirth"] = placeOfBirth }
        if let permanentAddress = result.permanentAddress { dict["permanentAddress"] = permanentAddress }
        if let issuingAuthority = result.issuingAuthority { dict["issuingAuthority"] = issuingAuthority }
        if let dateOfIssue = result.dateOfIssue { dict["dateOfIssue"] = dateOfIssue }
        if let dateOfExpiry = result.dateOfExpiry { dict["dateOfExpiry"] = dateOfExpiry }
        if let errorMessage = result.errorMessage { dict["errorMessage"] = errorMessage }

        if let facePhoto = result.facePhoto,
           let imageData = facePhoto.jpegData(compressionQuality: 0.8) {
            dict["facePhotoBase64"] = imageData.base64EncodedString()
        }

        return dict
    }
}
