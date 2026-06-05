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
            url: "https://github.com/Up2dateSoftware/EidRomaniaSDK/releases/download/1.4.21/RomanianEIDSDK.xcframework.zip",
            checksum: "ceca6e6d6d4c85420dad759d6054ab91e042db115f6553ea39c898e51fb2cb8c"
        ),
        .binaryTarget(
            name: "OpenSSL",
            path: "Frameworks/OpenSSL.xcframework"
        )
    ]
)
