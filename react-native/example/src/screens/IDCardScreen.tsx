/**
 * ID Card Reading Screen
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
import EIDReader, { IDCardResult } from 'react-native-romanian-eid-sdk';

export default function IDCardScreen() {
  const [can, setCan] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IDCardResult | null>(null);

  const handleReadIDCard = async () => {
    if (!can || !pin) {
      Alert.alert('Error', 'Please enter both CAN and PIN');
      return;
    }

    if (can.length !== 6) {
      Alert.alert('Error', 'CAN must be 6 digits');
      return;
    }

    if (pin.length < 4 || pin.length > 8) {
      Alert.alert('Error', 'PIN must be 4-8 digits');
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const idCardResult = await EIDReader.readIDCard(can, pin, {
        enableCSCAValidation: true,
        readPhoto: true,
        readSignature: true,
        timeout: 90,
      });

      setResult(idCardResult);

      if (idCardResult.success) {
        Alert.alert('Success', 'ID Card read successfully!');
      } else {
        Alert.alert('Error', idCardResult.errorMessage || 'Failed to read ID card');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to read ID card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Read Romanian ID Card</Text>
        <Text style={styles.subtitle}>
          Enter CAN and PIN, then hold your ID card to the phone
        </Text>

        {/* CAN Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CAN (6 digits)</Text>
          <TextInput
            style={styles.input}
            placeholder="123456"
            value={can}
            onChangeText={setCan}
            keyboardType="number-pad"
            maxLength={6}
            editable={!loading}
          />
        </View>

        {/* PIN Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>PIN (4-8 digits)</Text>
          <TextInput
            style={styles.input}
            placeholder="****"
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            maxLength={8}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {/* Read Button */}
        <TouchableOpacity
          style={[styles.readButton, loading && styles.readButtonDisabled]}
          onPress={handleReadIDCard}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.readButtonText}>🪪 Read ID Card</Text>
          )}
        </TouchableOpacity>

        {/* Result Display */}
        {result && result.success && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>✅ ID Card Data</Text>

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
              <Text style={styles.resultLabel}>CNP:</Text>
              <Text style={styles.resultValue}>{result.cnp}</Text>
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
              <Text style={styles.resultLabel}>Sex:</Text>
              <Text style={styles.resultValue}>{result.sex}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Expiry Date:</Text>
              <Text style={styles.resultValue}>{result.dateOfExpiry}</Text>
            </View>

            {result.citizenship && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Citizenship:</Text>
                <Text style={styles.resultValue}>{result.citizenship}</Text>
              </View>
            )}

            {result.placeOfBirth && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Place of Birth:</Text>
                <Text style={styles.resultValue}>{result.placeOfBirth}</Text>
              </View>
            )}

            {result.issuingAuthority && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Issued By:</Text>
                <Text style={styles.resultValue}>{result.issuingAuthority}</Text>
              </View>
            )}

            {result.permanentAddress && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Address:</Text>
                <Text style={styles.resultValue}>{result.permanentAddress}</Text>
              </View>
            )}

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>CSCA Validated:</Text>
              <Text style={styles.resultValue}>
                {result.cscaValidated ? '✅ Yes' : '❌ No'}
              </Text>
            </View>

            {result.signatureImageBase64 && (
              <View style={styles.signatureContainer}>
                <Text style={styles.label}>Signature:</Text>
                <Image
                  source={{ uri: `data:image/png;base64,${result.signatureImageBase64}` }}
                  style={styles.signature}
                  resizeMode="contain"
                />
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
  inputContainer: {
    marginBottom: 16,
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
  },
  readButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
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
  signatureContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  signature: {
    width: '100%',
    height: 80,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
});
