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
      // Trial license v2.0 — bundleId com.up2date.EIDSDKExample, valid until 2036, minSdkVersion 1.6.0
      const demoLicense =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImVpZC1zZGstcHJvZC12MiJ9.eyJpc3MiOiJSb21hbmlhbkVJRFNESyIsInN1YiI6ImNvbS51cDJkYXRlLkVJRFNES0V4YW1wbGUiLCJpYXQiOjE3ODIzODU1OTAsImV4cCI6MjA5ODAwNDc5MCwianRpIjoiM2M2MDIyMTctOTM3Mi00Y2I3LWJjMTYtZGYxMTllYzIxODBjIiwiYnVuZGxlSWQiOiJjb20udXAyZGF0ZS5FSURTREtFeGFtcGxlIiwiY29tcGFueSI6IlNDIFVQMkRBVEUgU09GVFdBUkUgU1JMIiwiZmVhdHVyZXMiOlsicGFzc3BvcnRSZWFkaW5nIiwiaWRDYXJkUmVhZGluZyIsIm9jclNjYW5uaW5nIiwibXJ6U2Nhbm5pbmciLCJjc2NhVmFsaWRhdGlvbiIsImJpb21ldHJpY0V4dHJhY3Rpb24iLCJmYWNlTWF0Y2hpbmciLCJsaXZlbmVzc0RldGVjdGlvbiJdLCJ0eXBlIjoidHJpYWwiLCJsaWNlbnNpbmdNb2RlbCI6InVzYWdlIiwidmVyc2lvbiI6IjIuMCIsIm1heERldmljZXMiOjEwLCJsaWNlbnNlU2VydmVyIjoiaHR0cHM6Ly9laWRyb21hbmlhLnJvL2FwaS9saWNlbnNlIiwibWluU2RrVmVyc2lvbiI6IjEuNi4wIn0.FRoc4YcpbHdsCZDG_L2Uq9DLwIsDxoVZmNaiU6fz8p6kUnICPNRoCIxgoh8F2iSZmMRlwAP_xfoFaFrTSo0_3Elj_B1ARfQKpVJYGu7i51qd0t3fK-uGNeiY1LIeodD65v1sbLXYRY88P2o0PyeBJ7jKe2_2tVMzHl6MQcLfci8MnBY8JtHoAYi9b1T20JqoszxJc_NirQ4mPVZbjejVzx_rd3118_nVqrcKRFnX-kTHbEPY_60rwSUvapmXl29sKcrZHUBHotxL8orhXnGQAijLnlWINi77QSxlDaANQ6KqQEVEEm8xJnxSn-0fa44GPi9cvw5dx1aQoZ_nG9SY4g';

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
