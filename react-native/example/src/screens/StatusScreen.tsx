import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Platform,
} from 'react-native';
import EIDReader from '@up2date/romanian-eid-sdk';

export default function StatusScreen() {
  const [licenseInfo, setLicenseInfo] = useState<any>(null);
  const [nfcAvailable, setNfcAvailable] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const info = await EIDReader.getLicenseInfo();
      setLicenseInfo(info);

      const nfc = await EIDReader.isNFCAvailable();
      setNfcAvailable(nfc);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const openEmail = () => {
    Linking.openURL('mailto:support@up2date.ro');
  };

  const openDocs = () => {
    Linking.openURL('https://docs.up2date.ro/eid-sdk');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* SDK Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SDK Information</Text>
          <View style={styles.card}>
            <InfoRow label="Version" value={EIDReader.version} />
            <InfoRow label="Framework" value="RomanianEIDSDK" />
            <InfoRow label="Platform" value={`${Platform.OS} ${Platform.Version}`} />
          </View>
        </View>

        {/* License Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>License Status</Text>
          <View style={styles.card}>
            {licenseInfo ? (
              <>
                <View style={styles.statusRow}>
                  <Text style={licenseInfo.isValid ? styles.validIcon : styles.invalidIcon}>
                    {licenseInfo.isValid ? '✅' : '❌'}
                  </Text>
                  <Text style={styles.statusText}>
                    {licenseInfo.isValid ? 'Valid' : 'Invalid'}
                  </Text>
                </View>
                <InfoRow label="Company" value={licenseInfo.issuedTo} />
                <InfoRow label="Expires" value={licenseInfo.expiresAt} />
              </>
            ) : (
              <Text style={styles.infoValue}>Not Initialized</Text>
            )}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Features</Text>
          <View style={styles.card}>
            {licenseInfo && licenseInfo.features && licenseInfo.features.length > 0 ? (
              licenseInfo.features.map((feature: string, index: number) => (
                <View key={index} style={styles.featureRow}>
                  <Text style={styles.featureIcon}>✅</Text>
                  <Text style={styles.featureText}>{formatFeature(feature)}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoValue}>No features available</Text>
            )}
          </View>
        </View>

        {/* Device Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Information</Text>
          <View style={styles.card}>
            <InfoRow
              label="NFC Available"
              value={nfcAvailable ? 'Yes ✅' : 'No ❌'}
            />
            <InfoRow label="Device" value={Platform.OS === 'ios' ? 'iPhone' : 'Android'} />
            <InfoRow label="OS Version" value={String(Platform.Version)} />
          </View>
        </View>

        {/* Quick Start */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <View style={styles.card}>
            <InstructionStep
              number={1}
              title="Get License Key"
              description="Contact support to obtain a valid license key"
            />
            <InstructionStep
              number={2}
              title="Initialize SDK"
              description="Add license key in App initialization"
            />
            <InstructionStep
              number={3}
              title="Link SDK Package"
              description="Install @up2date/romanian-eid-sdk via npm"
            />
            <InstructionStep
              number={4}
              title="Test Reading"
              description="Use Passport, ID Card, or OCR tabs to test"
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.linkRow} onPress={openEmail}>
              <Text style={styles.linkIcon}>✉️</Text>
              <Text style={styles.linkText}>support@up2date.ro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRow} onPress={openDocs}>
              <Text style={styles.linkIcon}>📖</Text>
              <Text style={styles.linkText}>Documentation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function formatFeature(feature: string): string {
  const featureMap: Record<string, string> = {
    passportReading: 'Passport Reading',
    idCardReading: 'ID Card Reading',
    ocrScanning: 'OCR Scanning',
    cscaValidation: 'CSCA Validation',
    biometricExtraction: 'Biometric Extraction',
    advancedSecurity: 'Advanced Security',
  };
  return featureMap[feature] || feature;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function InstructionStep({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  validIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  invalidIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#000',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: '#8E8E93',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  linkIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
