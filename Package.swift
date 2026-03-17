// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "RomanianEIDSDK",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "RomanianEIDSDK",
            targets: ["RomanianEIDSDK"]
        ),
    ],
    dependencies: [
        // OpenSSL dependency
        .package(url: "https://github.com/krzyzanowskim/OpenSSL.git", from: "1.1.2300")
    ],
    targets: [
        .binaryTarget(
            name: "RomanianEIDSDK",
            url: "https://github.com/Up2dateSoftware/EidRomaniaSDK/releases/download/1.4.18/RomanianEIDSDK.xcframework.zip",
            checksum: "c45175470e211212330045c0547a0f8d1035b5a7cad31632ba294b0dd2d5ebbd"
        )
    ]
)
