require "json"

package = JSON.parse(File.read(File.join(__dir__, "../package.json")))

Pod::Spec.new do |s|
  s.name         = "RNRomanianEIDSDK"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "15.0" }
  s.source       = { :git => "https://github.com/up2datesoftware/RNRomanianEIDSDK.git", :tag => "#{s.version}" }

  s.source_files = "*.{h,m,swift}"

  s.dependency "React-Core"

  # Include the RomanianEIDSDK XCFramework
  s.vendored_frameworks = "RomanianEIDSDK.xcframework"

  s.swift_version = "5.0"
end
