require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RNRomanianEIDSDK"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "15.0" }
  s.source       = { :git => "https://github.com/up2datesoftware/RNRomanianEIDSDK.git", :tag => "#{s.version}" }

  # Source files are in ios/ subdirectory
  s.source_files = "ios/*.{h,m,swift}"

  s.dependency "React-Core"
  s.dependency "OpenSSL-Universal", "~> 1.1.1"

  # Include the RomanianEIDSDK XCFramework from ios/ subdirectory
  s.vendored_frameworks = "ios/RomanianEIDSDK.xcframework"

  s.swift_version = "5.0"

  # Required for Swift/ObjC interop - generates the -Swift.h header
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end
