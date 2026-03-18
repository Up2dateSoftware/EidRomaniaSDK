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
            targets: ["RomanianEIDSDKBinary", "RomanianEIDSDKDependencies"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/krzyzanowskim/OpenSSL.git", from: "1.1.2300")
    ],
    targets: [
        .binaryTarget(
            name: "RomanianEIDSDKBinary",
            url: "https://github.com/Up2dateSoftware/EidRomaniaSDK/releases/download/1.4.18/RomanianEIDSDK.xcframework.zip",
            checksum: "c45175470e211212330045c0547a0f8d1035b5a7cad31632ba294b0dd2d5ebbd"
        ),
        // This target brings in OpenSSL - the binary target can access it at runtime
        .target(
            name: "RomanianEIDSDKDependencies",
            dependencies: [
                .product(name: "OpenSSL", package: "OpenSSL")
            ],
            path: "Sources/Dependencies"
        )
    ]
)
