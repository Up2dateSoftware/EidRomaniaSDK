import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import EIDReader from '@up2date/romanian-eid-sdk';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  PassportResult: { result: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PassportScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [mrzKey, setMrzKey] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [mrzScanResult, setMrzScanResult] = useState<any>(null);

  const fillExample = () => {
    setMrzKey('RO1234567<0850315301231');
  };

  const scanMRZ = async () => {
    setIsScanning(true);
    setError('');
    setMrzScanResult(null);

    try {
      const mrzResult = await EIDReader.startMRZScanning();
      setMrzScanResult(mrzResult);
      setMrzKey(mrzResult.mrzKey);
    } catch (err: any) {
      if (err.code !== 'USER_CANCELLED') {
        setError(err.message || 'Failed to scan MRZ');
      }
    } finally {
      setIsScanning(false);
    }
  };

  const readPassport = async () => {
    if (!mrzKey) {
      Alert.alert('Error', 'Please enter or scan MRZ key');
      return;
    }

    setIsReading(true);
    setError('');
    setResult(null);

    try {
      const passportResult = await EIDReader.readPassport(mrzKey, {
        enableCSCAValidation: true,
        timeout: 60,
      });

      console.log('📋 Passport Result:', JSON.stringify(passportResult, null, 2));
      setIsReading(false);

      // Navigate to results screen
      navigation.navigate('PassportResult', { result: passportResult });
    } catch (err: any) {
      setError(err.message || 'Failed to read passport');
      setIsReading(false);
    }
  };

  const canRead = mrzKey.length > 0 && !isReading;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📘</Text>
          <Text style={styles.headerTitle}>Passport Reader</Text>
          <Text style={styles.headerSubtitle}>Read Romanian ePassports via NFC</Text>
        </View>

        {/* MRZ Scanner Button */}
        <TouchableOpacity
          style={[styles.scanButton, (isReading || isScanning) && styles.buttonDisabled]}
          onPress={scanMRZ}
          disabled={isReading || isScanning}>
          <Text style={styles.scanButtonIcon}>📷</Text>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan MRZ with Camera'}
          </Text>
        </TouchableOpacity>

        {/* MRZ Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Or Enter MRZ Key Manually</Text>
          <TextInput
            style={styles.input}
            value={mrzKey}
            onChangeText={setMrzKey}
            placeholder="RO1234567890123456789..."
            autoCapitalize="characters"
            editable={!isReading}
            fontFamily="Courier"
          />
          <Text style={styles.hint}>
            Format: Document# + DOB + Expiry (with check digits)
          </Text>
          <TouchableOpacity onPress={fillExample}>
            <Text style={styles.link}>Fill Example MRZ</Text>
          </TouchableOpacity>
        </View>

        {/* MRZ Scan Results */}
        {mrzScanResult && (
          <View style={styles.resultBox}>
            <View style={styles.resultHeader}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.resultTitle}>MRZ Scanned</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.resultText}>Document: {mrzScanResult.documentNumber}</Text>
            <Text style={styles.resultText}>
              Name: {mrzScanResult.givenNames} {mrzScanResult.surname}
            </Text>
            <Text style={styles.resultText}>DOB: {mrzScanResult.dateOfBirth}</Text>
            <Text style={styles.resultText}>Expiry: {mrzScanResult.dateOfExpiry}</Text>
            <Text style={styles.resultText}>Nationality: {mrzScanResult.nationality}</Text>
            <View style={styles.divider} />
            <Text style={[styles.resultText, styles.mrzKey]}>
              MRZ Key: {mrzScanResult.mrzKey}
            </Text>
          </View>
        )}

        {/* Read Button */}
        <TouchableOpacity
          style={[styles.readButton, !canRead && styles.buttonDisabled]}
          onPress={readPassport}
          disabled={!canRead}>
          {isReading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.readButtonIcon}>📡</Text>
          )}
          <Text style={styles.readButtonText}>
            {isReading ? 'Reading NFC...' : 'Read Passport'}
          </Text>
        </TouchableOpacity>

        {/* Error */}
        {error && (
          <View style={[styles.resultBox, styles.errorBox]}>
            <View style={styles.resultHeader}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={[styles.resultTitle, styles.errorText]}>Error</Text>
            </View>
            <Text style={styles.resultText}>{error}</Text>
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
    marginBottom: 24,
    paddingTop: 20,
  },
  headerIcon: {
    fontSize: 60,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Courier',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    color: '#007AFF',
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  readButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  readButtonText: {
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
  mrzKey: {
    fontFamily: 'Courier',
    color: '#007AFF',
    fontSize: 12,
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
});
