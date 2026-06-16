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
            url: "https://github.com/Up2dateSoftware/EidRomaniaSDK/releases/download/1.4.22/RomanianEIDSDK.xcframework.zip",
            checksum: "8a59a3e62162212c28fb14b3898eaa29afcd44f2ccf59ab0c0c9467a40669f8a"
        ),
        .binaryTarget(
            name: "OpenSSL",
            path: "Frameworks/OpenSSL.xcframework"
        )
    ]
)
