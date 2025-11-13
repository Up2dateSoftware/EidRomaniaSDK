/**
 * OCR Scanning Screen (for old non-NFC ID cards)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import EIDReader, { OCRScanResult } from 'react-native-romanian-eid-sdk';

export default function OCRScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OCRScanResult | null>(null);

  const handleScanOCR = async () => {
    try {
      setLoading(true);
      setResult(null);

      const ocrResult = await EIDReader.startOCRScanning();
      setResult(ocrResult);

      if (ocrResult.success && ocrResult.isReliable) {
        Alert.alert('Success', 'ID Card scanned successfully!');
      } else if (ocrResult.success && !ocrResult.isReliable) {
        Alert.alert(
          'Low Confidence',
          `Data extracted but confidence is low (${(ocrResult.confidence * 100).toFixed(0)}%). Please verify the results.`
        );
      } else {
        Alert.alert('Error', ocrResult.errorMessage || 'Failed to scan ID card');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to scan ID card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>OCR Scanner</Text>
        <Text style={styles.subtitle}>
          Scan old Romanian ID cards (without NFC chip) using camera
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📷 How to use:</Text>
          <Text style={styles.infoText}>
            1. Place ID card on a flat, well-lit surface{'\n'}
            2. Position camera directly above the card{'\n'}
            3. Make sure all text is clear and readable{'\n'}
            4. Capture the photo
          </Text>
        </View>

        {/* Scan Button */}
        <TouchableOpacity
          style={[styles.scanButton, loading && styles.scanButtonDisabled]}
          onPress={handleScanOCR}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.scanButtonText}>📷 Scan ID Card</Text>
          )}
        </TouchableOpacity>

        {/* Result Display */}
        {result && result.success && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                {result.isReliable ? '✅' : '⚠️'} Scan Result
              </Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>
                  {(result.confidence * 100).toFixed(0)}% confidence
                </Text>
              </View>
            </View>

            {!result.isReliable && result.validationIssues.length > 0 && (
              <View style={styles.warningBox}>
                <Text style={styles.warningTitle}>⚠️ Validation Issues:</Text>
                {result.validationIssues.map((issue, index) => (
                  <Text key={index} style={styles.warningText}>
                    • {issue}
                  </Text>
                ))}
              </View>
            )}

            {result.documentNumber && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Document Number:</Text>
                <Text style={styles.resultValue}>{result.documentNumber}</Text>
              </View>
            )}

            {result.cnp && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>CNP:</Text>
                <Text style={styles.resultValue}>{result.cnp}</Text>
              </View>
            )}

            {result.fullName && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Full Name:</Text>
                <Text style={styles.resultValue}>{result.fullName}</Text>
              </View>
            )}

            {result.dateOfBirth && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Date of Birth:</Text>
                <Text style={styles.resultValue}>{result.dateOfBirth}</Text>
              </View>
            )}

            {result.sex && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Sex:</Text>
                <Text style={styles.resultValue}>{result.sex}</Text>
              </View>
            )}

            {result.nationality && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Nationality:</Text>
                <Text style={styles.resultValue}>{result.nationality}</Text>
              </View>
            )}

            {result.placeOfBirth && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Place of Birth:</Text>
                <Text style={styles.resultValue}>{result.placeOfBirth}</Text>
              </View>
            )}

            {result.permanentAddress && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Address:</Text>
                <Text style={styles.resultValue}>{result.permanentAddress}</Text>
              </View>
            )}

            {result.issuingAuthority && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Issued By:</Text>
                <Text style={styles.resultValue}>{result.issuingAuthority}</Text>
              </View>
            )}

            {result.dateOfIssue && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Date of Issue:</Text>
                <Text style={styles.resultValue}>{result.dateOfIssue}</Text>
              </View>
            )}

            {result.dateOfExpiry && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Expiry Date:</Text>
                <Text style={styles.resultValue}>{result.dateOfExpiry}</Text>
              </View>
            )}
          </View>
        )}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  scanButtonDisabled: {
    backgroundColor: '#8E8E93',
  },
  scanButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  confidenceBadge: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#856404',
    marginTop: 2,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  resultLabel: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  resultValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});
