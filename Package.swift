// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "RomanianEIDSDK",
    platforms: [
        .iOS(.v14)
    ],
    products: [
        .library(
            name: "RomanianEIDSDK",
            targets: ["RomanianEIDSDKBinary", "OpenSSL"]
        ),
    ],
    targets: [
        .binaryTarget(
            name: "RomanianEIDSDKBinary",
            url: "https://github.com/Up2dateSoftware/EidRomaniaSDK/releases/download/1.4.23/RomanianEIDSDK.xcframework.zip",
            checksum: "8fcdee3208de4fb8ae46efbc46aa0931b8015a8649575daa839b14c32e27e6cc"
        ),
        .binaryTarget(
            name: "OpenSSL",
            path: "Frameworks/OpenSSL.xcframework"
        )
    ]
)
