import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  PassportResult: {
    result: any;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'PassportResult'>;

export default function PassportResultScreen({ route, navigation }: Props) {
  const { result } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Photo */}
        {result.facialImageBase64 && (
          <View style={styles.photoContainer}>
            <Image
              source={{
                uri: `data:image/jpeg;base64,${result.facialImageBase64}`,
              }}
              style={styles.photo}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <DataRow label="Full Name" value={result.fullName} />
          <DataRow label="CNP" value={result.cnp} />
          <DataRow label="Date of Birth" value={result.dateOfBirth} />
          <DataRow label="Place of Birth" value={result.placeOfBirth} />
          <DataRow label="Sex" value={result.sex} />
          <DataRow label="Nationality" value={result.nationality} />
        </View>

        {/* Document Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Information</Text>

          <DataRow label="Document Number" value={result.documentNumber} />
          <DataRow label="Document Type" value={result.documentType} />
          <DataRow label="Issuing Country" value={result.issuingCountry} />
          <DataRow label="Issue Date" value={result.dateOfIssue} />
          <DataRow label="Expiry Date" value={result.dateOfExpiry} />
        </View>

        {/* Security Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <View style={styles.dataRow}>
            <Text style={styles.label}>CSCA Validated</Text>
            <View style={styles.statusBadge}>
              <Text style={result.cscaValidated ? styles.statusSuccess : styles.statusError}>
                {result.cscaValidated ? '✓ Valid' : '✗ Invalid'}
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Done Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DataRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.dataRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  photoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  photo: {
    width: 200,
    height: 250,
    borderRadius: 8,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  statusSuccess: {
    color: '#34C759',
    fontWeight: '600',
  },
  statusError: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  jsonContainer: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
  },
  jsonText: {
    fontFamily: 'Courier',
    fontSize: 11,
    color: '#000',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
  },
  doneButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
