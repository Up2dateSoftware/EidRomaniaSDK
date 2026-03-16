Pod::Spec.new do |s|
  s.name             = 'RomanianEIDSDK'
  s.version          = '1.4.0'
  s.summary          = 'Romanian eID & Passport NFC Reader SDK'
  s.description      = <<-DESC
Professional SDK for reading Romanian electronic identity documents (ePassports and ID cards)
via NFC technology, with MRZ and OCR scanning capabilities.

Features:
- NFC Passport Reading with BAC/PACE protocols
- NFC ID Card Reading with PACE authentication
- MRZ (Machine Readable Zone) scanning
- OCR scanning for old non-NFC cards
- CSCA certificate validation
- Biometric data extraction (photos, signatures)
- ICAO 9303 compliant
                       DESC

  s.homepage         = 'https://github.com/Up2dateSoftware/EidRomaniaSDK'
  s.license          = { :type => 'Commercial', :file => 'ios/LICENSE.md' }
  s.author           = { 'Up2Date Software' => 'office@up2date.ro' }
  s.source           = { :git => 'https://github.com/Up2dateSoftware/EidRomaniaSDK.git', :tag => s.version.to_s }

  s.ios.deployment_target = '14.0'
  s.swift_version = '5.0'

  s.vendored_frameworks = 'ios/Framework/RomanianEIDSDK.xcframework'

  s.frameworks = 'Foundation', 'UIKit', 'CoreNFC', 'AVFoundation', 'Vision'

  s.pod_target_xcconfig = {
    'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64'
  }
  s.user_target_xcconfig = {
    'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64'
  }
end
