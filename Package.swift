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
            path: "ios/RomanianEIDSDK.xcframework.zip"
        )
    ]
)
