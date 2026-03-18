import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import EIDReader from '@up2date/romanian-eid-sdk';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  OCRResult: { result: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OCRScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const startScanning = async () => {
    setIsScanning(true);
    setError('');
    setResult(null);

    try {
      const ocrResult = await EIDReader.startOCRScanning();
      console.log('📋 OCR Result:', JSON.stringify(ocrResult, null, 2));
      setIsScanning(false);

      // Navigate to results screen
      navigation.navigate('OCRResult', { result: ocrResult });
    } catch (err: any) {
      if (err.code !== 'USER_CANCELLED') {
        setError(err.message || 'Failed to scan ID card');
      }
      setIsScanning(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📄</Text>
          <Text style={styles.headerTitle}>Scanare CI Veche (fără NFC)</Text>
          <Text style={styles.headerSubtitle}>
            Folosește camera pentru a scana{'\n'}cărți de identitate fără cip NFC
          </Text>
        </View>

        {/* Scan Button */}
        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.buttonDisabled]}
          onPress={startScanning}
          disabled={isScanning}>
          <Text style={styles.scanButtonIcon}>📷</Text>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanare...' : 'Începe Scanarea'}
          </Text>
        </TouchableOpacity>

        {/* Error */}
        {error && (
          <View style={[styles.resultBox, styles.errorBox]}>
            <View style={styles.resultHeader}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={[styles.resultTitle, styles.errorText]}>Eroare</Text>
            </View>
            <Text style={styles.resultText}>{error}</Text>
          </View>
        )}

        {/* Info Box */}
        {!result && !error && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ Informații</Text>
            <Text style={styles.infoText}>
              Această funcție scanează cărți de identitate vechi (fără cip NFC) folosind
              recunoaștere optică de caractere (OCR).
            </Text>
            <Text style={styles.infoText}>
              {'\n'}Plasează cartea pe o suprafață plană, cu lumină bună, și poziționează
              camera deasupra cărții.
            </Text>
            <Text style={styles.infoText}>
              {'\n'}Preciziunea poate varia în funcție de calitatea imaginii și starea
              cărții.
            </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 40,
  },
  headerIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  scanButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#8E8E93',
    opacity: 0.5,
  },
  resultBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successBox: {
    backgroundColor: '#E8F5E9',
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  successIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  successText: {
    color: '#34C759',
  },
  errorText: {
    color: '#FF3B30',
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D1D6',
    marginVertical: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: '600',
  },
  warningText: {
    color: '#FF9500',
    fontWeight: '600',
  },
  issueText: {
    color: '#FF9500',
    fontSize: 12,
    marginLeft: 8,
  },
  rawText: {
    fontFamily: 'Courier',
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
});
