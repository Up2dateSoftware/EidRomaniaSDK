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
            url: "https://github.com/Up2dateSoftware/EidRomaniaSDK/releases/download/1.4.19/RomanianEIDSDK.xcframework.zip",
            checksum: "c45175470e211212330045c0547a0f8d1035b5a7cad31632ba294b0dd2d5ebbd"
        ),
        .binaryTarget(
            name: "OpenSSL",
            url: "https://github.com/Up2dateSoftware/EidRomaniaSDK/releases/download/1.4.19/OpenSSL.xcframework.zip",
            checksum: "55a6be6398647e2c3fddefe14ae1096ed599530dbfd1a5d700b9f9e3cbdf7bf9"
        )
    ]
)
