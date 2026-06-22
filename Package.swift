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
            url: "https://github.com/Up2dateSoftware/EidRomaniaSDK/releases/download/1.6.0/RomanianEIDSDK.xcframework.zip",
            checksum: "f1594da40c65e7501339b9f5555e150d9f451a05ffc7deb3455e131a29d8bba6"
        ),
        .binaryTarget(
            name: "OpenSSL",
            path: "Frameworks/OpenSSL.xcframework"
        )
    ]
)
