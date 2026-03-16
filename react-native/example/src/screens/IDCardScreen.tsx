import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native';
import EIDReader from '@up2date/romanian-eid-sdk';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  IDCardResult: { result: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function IDCardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [can, setCan] = useState('');
  const [pin, setPin] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [readPhoto, setReadPhoto] = useState(true);
  const [readSignature, setReadSignature] = useState(true);

  const canValid = can.length === 6 && /^\d+$/.test(can);
  const pinValid = pin.length >= 4 && pin.length <= 8 && /^\d+$/.test(pin);
  const canRead = canValid && pinValid && !isReading;

  const readIDCard = async () => {
    if (!canValid || !pinValid) {
      Alert.alert('Error', 'Please enter valid CAN and PIN');
      return;
    }

    console.log('🚀 Starting ID Card read with CAN: '+can+' and PIN:'+pin);
    setIsReading(true);
    setError('');
    setResult(null);

    try {
      console.log('📞 Calling EIDReader.readIDCard...');
      const cardResult = await EIDReader.readIDCard(can, pin, {
        enableCSCAValidation: true,
        readPhoto,
        readSignature,
        timeout: 90,
      });

      console.log('✅ ID Card Result:', JSON.stringify(cardResult, null, 2));
      console.log('🔍 Available keys:', Object.keys(cardResult));
      console.log('📅 dateOfExpiry value:', cardResult.dateOfExpiry);
      console.log('🆔 documentNumber value:', cardResult.documentNumber);
      console.log('👤 sex value:', cardResult.sex);
      console.log('🏛️ issuingAuthority value:', cardResult.issuingAuthority);
      setIsReading(false);

      // Navigate to results screen
      navigation.navigate('IDCardResult', { result: cardResult });
    } catch (err: any) {
      console.error('❌ ID Card Error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      setError(err.message || 'Failed to read ID card');
      setIsReading(false);
    } finally {
      console.log('🏁 ID Card read finished');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🪪</Text>
          <Text style={styles.headerTitle}>ID Card Reader</Text>
          <Text style={styles.headerSubtitle}>
            Read Romanian Electronic ID Cards via NFC
          </Text>
        </View>

        {/* CAN Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CAN (Card Access Number)</Text>
          <TextInput
            style={styles.input}
            value={can}
            onChangeText={(text) => setCan(text.slice(0, 6))}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            editable={!isReading}
          />
          <View style={styles.hintRow}>
            <Text style={styles.hintIcon}>ℹ️</Text>
            <Text style={styles.hint}>6-digit number on bottom right of ID card</Text>
          </View>

          {can.length > 0 && (
            <View style={styles.validationRow}>
              <Text style={canValid ? styles.validIcon : styles.invalidIcon}>
                {canValid ? '✅' : '❌'}
              </Text>
              <Text style={canValid ? styles.validText : styles.invalidText}>
                {canValid ? 'Valid CAN format' : 'CAN must be 6 digits'}
              </Text>
            </View>
          )}
        </View>

        {/* PIN Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PIN (Personal Identification Number)</Text>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={(text) => setPin(text.slice(0, 8))}
            placeholder="****"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={8}
            editable={!isReading}
          />
          <View style={styles.hintRow}>
            <Text style={styles.hintIcon}>🔒</Text>
            <Text style={styles.hint}>4-8 digit PIN code for your ID card</Text>
          </View>

          {pin.length > 0 && (
            <View style={styles.validationRow}>
              <Text style={pinValid ? styles.validIcon : styles.invalidIcon}>
                {pinValid ? '✅' : '❌'}
              </Text>
              <Text style={pinValid ? styles.validText : styles.invalidText}>
                {pinValid ? 'Valid PIN format' : 'PIN must be 4-8 digits'}
              </Text>
            </View>
          )}
        </View>

        {/* Options */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <Text style={styles.toggleIcon}>{readPhoto ? '👤' : '👤'}</Text>
              <Text style={styles.toggleText}>Citește Fotografie</Text>
            </View>
            <Switch
              value={readPhoto}
              onValueChange={setReadPhoto}
              disabled={isReading}
              trackColor={{ false: '#D1D1D6', true: '#34C759' }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <Text style={styles.toggleIcon}>✍️</Text>
              <Text style={styles.toggleText}>Citește Semnătură</Text>
            </View>
            <Switch
              value={readSignature}
              onValueChange={setReadSignature}
              disabled={isReading}
              trackColor={{ false: '#D1D1D6', true: '#34C759' }}
            />
          </View>

          <Text style={styles.optionsHint}>
            {!readPhoto && !readSignature
              ? 'Citire rapidă - doar date text (~30-40s)'
              : 'Cu foto/semnătură citirea durează ~60-90s'}
          </Text>
        </View>

        {/* Read Button */}
        <TouchableOpacity
          style={[styles.readButton, !canRead && styles.buttonDisabled]}
          onPress={readIDCard}
          disabled={!canRead}>
          {isReading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.readButtonIcon}>📡</Text>
          )}
          <Text style={styles.readButtonText}>
            {isReading ? 'Reading NFC...' : 'Read ID Card'}
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
    textAlign: 'center',
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
    fontSize: 20,
    fontFamily: 'Courier',
    marginBottom: 8,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hintIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  hint: {
    fontSize: 12,
    color: '#8E8E93',
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  validIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  invalidIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  validText: {
    fontSize: 14,
    color: '#34C759',
  },
  invalidText: {
    fontSize: 14,
    color: '#FF3B30',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  toggleText: {
    fontSize: 16,
    color: '#000',
  },
  optionsHint: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
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
  photoContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  signature: {
    width: 250,
    height: 100,
    borderRadius: 8,
    marginTop: 8,
  },
});
