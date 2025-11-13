/**
 * Status and SDK Information Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import EIDReader, { LicenseInfo } from 'react-native-romanian-eid-sdk';

export default function StatusScreen() {
  const [nfcAvailable, setNfcAvailable] = useState(false);
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);

      // Check NFC availability
      const nfc = await EIDReader.isNFCAvailable();
      setNfcAvailable(nfc);

      // Get license info
      try {
        const info = await EIDReader.getLicenseInfo();
        setLicenseInfo(info);
      } catch (error) {
        console.log('No license info available');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SDK Status</Text>

        {/* SDK Version */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SDK Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version:</Text>
            <Text style={styles.infoValue}>{EIDReader.version}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform:</Text>
            <Text style={styles.infoValue}>React Native</Text>
          </View>
        </View>

        {/* NFC Status */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hardware Status</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NFC Available:</Text>
            <Text style={[styles.infoValue, nfcAvailable ? styles.success : styles.error]}>
              {nfcAvailable ? '✅ Yes' : '❌ No'}
            </Text>
          </View>
          {!nfcAvailable && (
            <Text style={styles.warningText}>
              NFC is not available on this device. You can only use OCR scanning.
            </Text>
          )}
        </View>

        {/* License Information */}
        {licenseInfo && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>License Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={[styles.infoValue, licenseInfo.isValid ? styles.success : styles.error]}>
                {licenseInfo.isValid ? '✅ Valid' : '❌ Invalid'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Issued To:</Text>
              <Text style={styles.infoValue}>{licenseInfo.issuedTo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Expires:</Text>
              <Text style={styles.infoValue}>
                {new Date(licenseInfo.expiresAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tier:</Text>
              <Text style={styles.infoValue}>{licenseInfo.tier}</Text>
            </View>

            <Text style={styles.featuresTitle}>Enabled Features:</Text>
            <View style={styles.featuresList}>
              {licenseInfo.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureText}>✓ {feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Refresh Button */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadStatus}
          disabled={loading}>
          <Text style={styles.refreshButtonText}>🔄 Refresh Status</Text>
        </TouchableOpacity>

        {/* About */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About Romanian eID SDK</Text>
          <Text style={styles.aboutText}>
            This SDK provides functionality to read Romanian electronic identity documents
            including ePassports and electronic ID cards using NFC technology.
          </Text>
          <Text style={styles.aboutText}>
            © 2025 Up2Date. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  infoValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  success: {
    color: '#34C759',
  },
  error: {
    color: '#FF3B30',
  },
  warningText: {
    fontSize: 13,
    color: '#FF9500',
    marginTop: 8,
    fontStyle: 'italic',
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 12,
    marginBottom: 8,
  },
  featuresList: {
    marginTop: 4,
  },
  featureItem: {
    paddingVertical: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#34C759',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginTop: 4,
  },
});
