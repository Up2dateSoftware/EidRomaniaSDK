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
            url: "https://github.com/Up2dateSoftware/EidRomaniaSDK/releases/download/v1.4.17/RomanianEIDSDK.xcframework.zip",
            checksum: "434015bdca0d244ae6a8b763ebbb9304ea5dbd0ca0c7642161a88c9e5477dc0c"
        )
    ]
)
