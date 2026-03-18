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
  OCRResult: {
    result: any;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'OCRResult'>;

export default function OCRResultScreen({ route, navigation }: Props) {
  const { result } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Captured Image */}
        {result.capturedImageBase64 && (
          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>Captured Document</Text>
            <Image
              source={{
                uri: `data:image/jpeg;base64,${result.capturedImageBase64}`,
              }}
              style={styles.documentImage}
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
          <DataRow label="Series" value={result.series} />
          <DataRow label="Number" value={result.number} />
        </View>

        {/* Address Information */}
        {(result.county || result.locality || result.street) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>

            <DataRow label="County" value={result.county} />
            <DataRow label="Locality" value={result.locality} />
            <DataRow label="Street" value={result.street} />
            <DataRow label="Street Number" value={result.streetNumber} />
            <DataRow label="Building" value={result.building} />
            <DataRow label="Staircase" value={result.staircase} />
            <DataRow label="Floor" value={result.floor} />
            <DataRow label="Apartment" value={result.apartment} />
          </View>
        )}

        {/* Document Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Information</Text>

          <DataRow label="Document Number" value={result.documentNumber} />
          <DataRow label="Document Type" value={result.documentType} />
          <DataRow label="Issue Date" value={result.dateOfIssue} />
          <DataRow label="Expiry Date" value={result.dateOfExpiry} />
          <DataRow label="Issued By" value={result.issuedBy} />
        </View>

        {/* OCR Confidence */}
        {result.confidence !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OCR Quality</Text>

            <View style={styles.dataRow}>
              <Text style={styles.label}>Confidence</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>
                  {(result.confidence * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        )}

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
  imageContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 12,
  },
  documentImage: {
    width: '100%',
    height: 200,
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
  confidenceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  confidenceText: {
    color: 'white',
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
