Pod::Spec.new do |s|
  s.name             = 'romanian_eid_sdk'
  s.version          = '1.0.0'
  s.summary          = 'Flutter plugin for reading Romanian electronic identity documents via NFC.'
  s.description      = <<-DESC
Flutter plugin for reading Romanian electronic identity documents (passports and ID cards) via NFC.
Uses BAC (Basic Access Control) and PACE (Password Authenticated Connection Establishment) protocols.
                       DESC
  s.homepage         = 'https://eidromania.com'
  s.license          = { :file => '../LICENSE' }
  s.author           = { 'Up2Date Software' => 'contact@eidromania.com' }
  s.source           = { :path => '.' }
  s.source_files     = 'Classes/**/*'
  s.dependency 'Flutter'
  s.platform         = :ios, '13.0'

  # TODO: Add dependency on RomanianEIDSDK when distributing
  # s.dependency 'RomanianEIDSDK', '~> 1.4.17'
  # Or use vendored framework:
  # s.vendored_frameworks = 'Frameworks/RomanianEIDSDK.xcframework'

  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386' }
  s.swift_version = '5.0'
end
