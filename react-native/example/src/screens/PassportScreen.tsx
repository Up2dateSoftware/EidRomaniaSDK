/**
 * Passport Reading Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import EIDReader, { PassportResult } from 'react-native-romanian-eid-sdk';

export default function PassportScreen() {
  const [mrzKey, setMrzKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PassportResult | null>(null);

  const handleScanMRZ = async () => {
    try {
      setLoading(true);
      const mrzResult = await EIDReader.startMRZScanning();
      setMrzKey(mrzResult.mrzKey);
      Alert.alert('MRZ Scanned', `Document: ${mrzResult.documentNumber}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to scan MRZ');
    } finally {
      setLoading(false);
    }
  };

  const handleReadPassport = async () => {
    if (!mrzKey) {
      Alert.alert('Error', 'Please enter or scan MRZ key first');
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const passportResult = await EIDReader.readPassport(mrzKey, {
        enableCSCAValidation: true,
        timeout: 60,
      });

      setResult(passportResult);

      if (passportResult.success) {
        Alert.alert('Success', 'Passport read successfully!');
      } else {
        Alert.alert('Error', passportResult.errorMessage || 'Failed to read passport');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to read passport');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Read Romanian Passport</Text>
        <Text style={styles.subtitle}>
          Scan the MRZ or enter it manually, then hold your passport to the phone
        </Text>

        {/* MRZ Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>MRZ Key</Text>
          <TextInput
            style={styles.input}
            placeholder="RO123456789012345678"
            value={mrzKey}
            onChangeText={setMrzKey}
            autoCapitalize="characters"
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScanMRZ}
            disabled={loading}>
            <Text style={styles.scanButtonText}>📷 Scan MRZ</Text>
          </TouchableOpacity>
        </View>

        {/* Read Button */}
        <TouchableOpacity
          style={[styles.readButton, loading && styles.readButtonDisabled]}
          onPress={handleReadPassport}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.readButtonText}>📘 Read Passport</Text>
          )}
        </TouchableOpacity>

        {/* Result Display */}
        {result && result.success && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>✅ Passport Data</Text>

            {result.facialImageBase64 && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${result.facialImageBase64}` }}
                style={styles.photo}
                resizeMode="contain"
              />
            )}

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Document Number:</Text>
              <Text style={styles.resultValue}>{result.documentNumber}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Full Name:</Text>
              <Text style={styles.resultValue}>{result.fullName}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Date of Birth:</Text>
              <Text style={styles.resultValue}>{result.dateOfBirth}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Nationality:</Text>
              <Text style={styles.resultValue}>{result.nationality}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Sex:</Text>
              <Text style={styles.resultValue}>{result.sex}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Expiry Date:</Text>
              <Text style={styles.resultValue}>{result.dateOfExpiry}</Text>
            </View>

            {result.cnp && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>CNP:</Text>
                <Text style={styles.resultValue}>{result.cnp}</Text>
              </View>
            )}

            {result.placeOfBirth && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Place of Birth:</Text>
                <Text style={styles.resultValue}>{result.placeOfBirth}</Text>
              </View>
            )}

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>CSCA Validated:</Text>
              <Text style={styles.resultValue}>
                {result.cscaValidated ? '✅ Yes' : '❌ No'}
              </Text>
            </View>
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 12,
  },
  scanButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  scanButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  readButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  readButtonDisabled: {
    backgroundColor: '#8E8E93',
  },
  readButtonText: {
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
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 16,
  },
  photo: {
    width: 150,
    height: 180,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 8,
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
