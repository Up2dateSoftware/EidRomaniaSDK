/**
 * Romanian eID SDK Demo App
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EIDReader from '@up2date/romanian-eid-sdk';

import PassportScreen from './src/screens/PassportScreen';
import IDCardScreen from './src/screens/IDCardScreen';
import OCRScreen from './src/screens/OCRScreen';
import StatusScreen from './src/screens/StatusScreen';
import PassportResultScreen from './src/screens/PassportResultScreen';
import IDCardResultScreen from './src/screens/IDCardResultScreen';
import OCRResultScreen from './src/screens/OCRResultScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = async () => {
    try {
      // Demo license for com.up2date.ReactEIDTestApp
      const demoLicense =
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSb21hbmlhbkVJRFNESyIsInN1YiI6ImNvbS5laWR0ZXN0YXBwIiwiaWF0IjoxNzYzMzY1NTIwLCJleHAiOjE3NjQ2NjE1MjAsImJ1bmRsZUlkIjoiY29tLmVpZHRlc3RhcHAiLCJjb21wYW55IjoiVVAyREFURSBTT0ZXVEFSRSBTUkwiLCJmZWF0dXJlcyI6WyJwYXNzcG9ydFJlYWRpbmciLCJpZENhcmRSZWFkaW5nIiwiY3NjYVZhbGlkYXRpb24iLCJhZHZhbmNlZFNlY3VyaXR5Il0sInR5cGUiOiJ0cmlhbCIsInZlcnNpb24iOiIxLjAifQ.MnTzrbEudg1L6_oOqH9ORDumHfZCqkBH4afxhzDEgAVqc1K8PsGxDIiMyuXrak1gEhfXrTztdlsUGhboMc-hB0mZxXK7pjlbGkr9sKkbGVeYSmi2U6Jbg2cga6HZry6CwQjr1yaf3lODM8ezeyPSfE637IacGcf9HlrPApE1wmcKknHLF4KHciGIKh-50gVtBBcf_LUk-idh057Q1cWYFsMy9T29twZ-ivV4DXcbwK0WejbmV2PaWKiVnM59ZgotlzM-mYuzWiiyAeeXkXqsZUvrcJC24u_U9Zq_duBjYivJyNjmONuzTNy0C5BzTTmFuaScxmOJU0GkJyxO_dKk8A';

      await EIDReader.initialize(demoLicense);
      setInitialized(true);
      console.log('✅ SDK initialized successfully');
    } catch (error) {
      console.error('❌ SDK init failed:', error);
      Alert.alert('Initialization Error', `Failed to initialize SDK: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centerView}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Initializing SDK...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!initialized) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centerView}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>SDK Not Initialized</Text>
          <Text style={styles.errorText}>Check your license key</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="PassportResult"
          component={PassportResultScreen}
          options={{
            headerShown: true,
            title: 'Passport Details',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="IDCardResult"
          component={IDCardResultScreen}
          options={{
            headerShown: true,
            title: 'ID Card Details',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="OCRResult"
          component={OCRResultScreen}
          options={{
            headerShown: true,
            title: 'OCR Results',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#D1D1D6',
        },
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Passport"
        component={PassportScreen}
        options={{
          title: 'Passport',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📘</Text>,
        }}
      />
      <Tab.Screen
        name="IDCard"
        component={IDCardScreen}
        options={{
          title: 'ID Card',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🪪</Text>,
        }}
      />
      <Tab.Screen
        name="OCR"
        component={OCRScreen}
        options={{
          title: 'OCR',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📄</Text>,
        }}
      />
      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          title: 'Status',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>ℹ️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#000',
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default App;
