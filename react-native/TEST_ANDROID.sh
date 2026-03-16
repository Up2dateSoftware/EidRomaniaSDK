#!/bin/bash

# Quick test script for Android React Native bridge
# Usage: ./TEST_ANDROID.sh

set -e

echo "🚀 Romanian eID SDK - Android Bridge Test Script"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}[1/7]${NC} Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java not found. Please install JDK 11+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Java: $(java -version 2>&1 | head -n 1)${NC}"

if [ -z "$ANDROID_HOME" ]; then
    echo -e "${YELLOW}⚠️  ANDROID_HOME not set. Make sure Android SDK is installed.${NC}"
else
    echo -e "${GREEN}✅ Android SDK: $ANDROID_HOME${NC}"
fi

if ! command -v adb &> /dev/null; then
    echo -e "${RED}❌ adb not found. Please install Android SDK platform-tools${NC}"
    exit 1
fi
echo -e "${GREEN}✅ adb: $(adb --version | head -n 1)${NC}"

echo ""

# Step 2: Check if device is connected
echo -e "${BLUE}[2/7]${NC} Checking for Android device..."

DEVICES=$(adb devices | grep -v "List" | grep "device" | wc -l)
if [ "$DEVICES" -eq 0 ]; then
    echo -e "${RED}❌ No Android device connected${NC}"
    echo -e "${YELLOW}Please connect an Android device via USB and enable USB debugging${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Android device connected${NC}"

# Check device info
DEVICE_MODEL=$(adb shell getprop ro.product.model)
ANDROID_VERSION=$(adb shell getprop ro.build.version.release)
echo -e "${GREEN}   Device: $DEVICE_MODEL (Android $ANDROID_VERSION)${NC}"

# Check NFC
if adb shell pm list features | grep -q "android.hardware.nfc"; then
    echo -e "${GREEN}✅ Device has NFC hardware${NC}"
else
    echo -e "${YELLOW}⚠️  Device doesn't have NFC - you won't be able to test card reading${NC}"
fi

echo ""

# Step 3: Navigate to example directory
echo -e "${BLUE}[3/7]${NC} Navigating to example directory..."
cd "$(dirname "$0")/example"
echo -e "${GREEN}✅ Directory: $(pwd)${NC}"
echo ""

# Step 4: Install dependencies
echo -e "${BLUE}[4/7]${NC} Installing dependencies..."
if [ -f "yarn.lock" ]; then
    echo "Using Yarn..."
    yarn install
else
    echo "Using npm..."
    npm install
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 5: Clean Android build
echo -e "${BLUE}[5/7]${NC} Cleaning Android build..."
cd android
./gradlew clean
cd ..
echo -e "${GREEN}✅ Android build cleaned${NC}"
echo ""

# Step 6: Start Metro bundler in background
echo -e "${BLUE}[6/7]${NC} Starting Metro bundler..."
echo -e "${YELLOW}Metro will run in background. Check terminal for Metro logs.${NC}"

# Kill any existing Metro processes
pkill -f "react-native/node_modules/react-native/scripts/launchPackager" || true
pkill -f "metro" || true

# Start Metro in background
npm start &
METRO_PID=$!
echo -e "${GREEN}✅ Metro started (PID: $METRO_PID)${NC}"

# Wait for Metro to start
echo "Waiting for Metro to start (10 seconds)..."
sleep 10
echo ""

# Step 7: Build and run on Android
echo -e "${BLUE}[7/7]${NC} Building and running app on Android..."
echo -e "${YELLOW}This may take a few minutes on first build...${NC}"
echo ""

# Run the app
npm run android

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ App launched successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Open the app on your Android device"
echo "2. Go to Status tab to verify SDK initialization"
echo "3. Enable NFC in device settings"
echo "4. Go to ID Card tab to test reading"
echo "5. Have your Romanian eID card ready (with CAN and PIN)"
echo ""
echo -e "${BLUE}Debugging:${NC}"
echo "- View logs: adb logcat | grep -E 'RNRomanianEIDSDK|EIDReader'"
echo "- Clear logs: adb logcat -c"
echo "- Reload app: Press 'r' in Metro terminal or shake device → Reload"
echo ""
echo -e "${BLUE}Stop Metro:${NC}"
echo "- Run: kill $METRO_PID"
echo "- Or press Ctrl+C in Metro terminal"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Test on a physical device with NFC, not emulator!${NC}"
echo ""
echo "Happy testing! 🎉"
