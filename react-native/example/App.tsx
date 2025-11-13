/**
 * RomanianEIDSDK Example App
 * Copyright © 2025 Up2Date. All rights reserved.
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import EIDReader from 'react-native-romanian-eid-sdk';

// Import screens
import PassportScreen from './src/screens/PassportScreen';
import IDCardScreen from './src/screens/IDCardScreen';
import OCRScreen from './src/screens/OCRScreen';
import StatusScreen from './src/screens/StatusScreen';

const Tab = createBottomTabNavigator();

// Demo license key - replace with your own
const DEMO_LICENSE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

function App(): React.JSX.Element {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = async () => {
    try {
      // Initialize SDK with license
      await EIDReader.initialize(DEMO_LICENSE_KEY);
      setInitialized(true);
      console.log('✅ SDK initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize SDK:', error);
      Alert.alert(
        'Initialization Error',
        'Failed to initialize SDK. Please check your license key.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing SDK...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!initialized) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>SDK Not Initialized</Text>
          <Text style={styles.errorMessage}>
            Please check your license key and try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
        }}>
        <Tab.Screen
          name="Passport"
          component={PassportScreen}
          options={{
            title: 'Passport',
            tabBarIcon: ({ color }) => <Text style={{ color }}>📘</Text>,
          }}
        />
        <Tab.Screen
          name="IDCard"
          component={IDCardScreen}
          options={{
            title: 'ID Card',
            tabBarIcon: ({ color }) => <Text style={{ color }}>🪪</Text>,
          }}
        />
        <Tab.Screen
          name="OCR"
          component={OCRScreen}
          options={{
            title: 'OCR',
            tabBarIcon: ({ color }) => <Text style={{ color }}>📷</Text>,
          }}
        />
        <Tab.Screen
          name="Status"
          component={StatusScreen}
          options={{
            title: 'Status',
            tabBarIcon: ({ color }) => <Text style={{ color }}>ℹ️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default App;
