# 📱 Ghid Testare Android - React Native Bridge

Acest ghid te va ajuta să testezi implementarea Android bridge pentru React Native Romanian eID SDK.

## 📋 Cerințe

### Hardware
- ✅ Telefon/Tabletă Android cu NFC (API 28+, Android 9.0+)
- ✅ Cablu USB pentru debugging
- ✅ Carte de identitate electronică românească (cu CAN și PIN)

### Software
- ✅ Node.js 18+
- ✅ Java JDK 11+
- ✅ Android Studio (latest)
- ✅ Android SDK (API 28-36)
- ✅ React Native CLI

## 🚀 Pași de Testare

### 1. Verificare Dependențe

```bash
# Verifică Node.js
node --version  # Trebuie >= 18

# Verifică Java
java -version   # Trebuie 11+

# Verifică Android SDK
echo $ANDROID_HOME  # Trebuie setat
```

### 2. Instalare Dependencies

```bash
cd react-native/example

# Instalează npm packages
npm install
# sau
yarn install

# Sincronizează Gradle (Android)
cd android
./gradlew clean
cd ..
```

### 3. Verifică că Bridge-ul este Linked Corect

```bash
# Verifică că modulul nativ este detectat
npx react-native info
```

Ar trebui să vezi `react-native-romanian-eid-sdk` în lista de libraries.

### 4. Configurare Android

#### A. Verifică `android/build.gradle` (project level)

Trebuie să conțină repositories pentru SDK:

```gradle
allprojects {
    repositories {
        // eID Romania SDK — Google Cloud Artifact Registry (public read).
        maven {
            url = uri("https://europe-west1-maven.pkg.dev/eid-romania/eid-romania-sdk")
        }
    }
}
```

#### B. Verifică `android/app/build.gradle`

Asigură-te că are:
- `minSdkVersion 28`
- `compileSdkVersion 36`

#### C. Verifică `android/app/src/main/AndroidManifest.xml`

Trebuie să conțină:

```xml
<uses-permission android:name="android.permission.NFC" />
<uses-permission android:name="android.permission.CAMERA" />

<uses-feature
    android:name="android.hardware.nfc"
    android:required="false" />
```

### 5. Rulare Aplicație pe Android

```bash
# Pornește Metro bundler într-un terminal
npm start
# sau
yarn start

# În alt terminal, rulează pe Android
npm run android
# sau
yarn android
```

### 6. Activare NFC pe Telefon

1. Mergi la **Settings** → **Connected devices** → **Connection preferences**
2. Activează **NFC**
3. Asigură-te că telefonul este deblocat (NFC nu funcționează cu ecran blocat)

### 7. Testare Pas cu Pas

#### Test 1: Verificare SDK Initialization

1. Deschide aplicația
2. Ar trebui să vezi tab-urile: **Passport**, **ID Card**, **OCR**, **Status**
3. Navighează la tab-ul **Status**
4. Verifică:
   - ✅ SDK Version: 1.0.0
   - ✅ Platform: Android
   - ✅ License Status: Active/Trial
   - ✅ NFC Available: Yes

**Ce să cauți în logs:**

```bash
# Rulează logcat într-un terminal separat
adb logcat | grep -E "RNRomanianEIDSDK|EIDReader"
```

Ar trebui să vezi:
```
D/RNRomanianEIDSDK: Initializing eID Romania SDK...
I/RNRomanianEIDSDK: SDK initialized successfully
```

#### Test 2: Verificare NFC Availability

1. Tab **Status** → vezi "NFC Available: Yes"
2. Dezactivează NFC din setări
3. Refresh aplicația
4. Ar trebui să vadă "NFC Available: No"

#### Test 3: Citire Carte Identitate (Happy Path)

1. Navighează la tab-ul **ID Card**
2. Introdu:
   - **CAN**: 6 cifre de pe spatele cărții (ex: 123456)
   - **PIN**: 4 cifre PIN-ul tău (ex: 0000)
3. Bifează opțiunile:
   - ☑️ Read Photo
   - ☑️ Read Signature
4. Apasă **"Citește Card"**

**Ar trebui să vezi:**

- Progress bar cu mesaje:
  - "Waiting for card..." (0%)
  - "Card detected, starting reading..." (10%)
  - "Reading data groups..." (20-80%)
  - "Processing..." (90-100%)

5. **Apropie cardul de telefon** (pe partea din spate)
6. Ține cardul nemișcat 5-10 secunde

**Rezultat așteptat:**

Ecran de success cu:
- ✅ Fotografie facială
- ✅ Semnătură digitală
- ✅ CNP: 1234567890123
- ✅ Nume complet
- ✅ Data nașterii
- ✅ Adresa
- ✅ Număr document
- ✅ Data expirare

**Logcat ar trebui să arate:**

```
D/RNRomanianEIDSDK: Starting ID card reading...
D/EIDReader: PACE authentication with CAN
D/EIDReader: Reading biometric data (DG2, DG7)
D/EIDReader: Reading personal data (DG1, DG2, DG4, DG6)
I/RNRomanianEIDSDK: Card read successfully
```

#### Test 4: Validare Input (CAN Incorect)

1. Introdu CAN: **"12345"** (doar 5 cifre)
2. Introdu PIN: **"0000"**
3. Apasă **"Citește Card"**

**Rezultat așteptat:**
- ❌ Eroare: "CAN must be 6 digits"
- Nu pornește citirea

#### Test 5: Validare Input (PIN Incorect)

1. Introdu CAN: **"123456"**
2. Introdu PIN: **"00"** (doar 2 cifre)
3. Apasă **"Citește Card"**

**Rezultat așteptat:**
- ❌ Eroare: "PIN must be 4 digits"

#### Test 6: CAN Greșit (Runtime Error)

1. Introdu CAN: **"999999"** (6 cifre, dar greșit)
2. Introdu PIN corect
3. Apropie cardul
4. Așteaptă

**Rezultat așteptat:**
- ❌ Eroare: "CAN incorect. Verificați codul CAN de 6 cifre de pe card."

**Logcat:**
```
E/EIDReader: Invalid CAN error
W/RNRomanianEIDSDK: INVALID_CAN error
```

#### Test 7: PIN Greșit (3 Încercări)

1. Introdu CAN corect
2. Introdu PIN: **"9999"** (greșit)
3. Apropie cardul

**Rezultat așteptat:**
- ❌ Eroare: "PIN incorect. Mai aveți 2 încercări."

**⚠️ ATENȚIE:** După 3 încercări greșite, cardul se blochează! Testează cu grijă.

#### Test 8: Tag Lost (Îndepărtare Card Prematură)

1. Start citire cu CAN/PIN corect
2. Apropie cardul
3. Când vezi "Reading data groups...", **îndepărtează cardul**

**Rezultat așteptat:**
- ❌ Eroare: "Conexiune pierdută cu cardul. Mențineți cardul aproape și încercați din nou."

#### Test 9: Timeout (Nu Apropii Cardul)

1. Start citire cu CAN/PIN corect
2. **NU** apropia cardul
3. Așteaptă 30 secunde

**Rezultat așteptat:**
- ❌ Eroare: "Timeout waiting for card. Please bring card closer."

#### Test 10: Progress Events

Verifică că progress events sunt emise corect:

```javascript
// În App.tsx sau IDCardScreen.tsx
EIDReader.onReadProgress((event) => {
  console.log(`Progress: ${event.percentage}% - ${event.message}`);
});
```

**Ar trebui să vezi în logcat:**
```
Progress: 0% - Waiting for card...
Progress: 10% - Card detected, starting reading...
Progress: 30% - Reading biometric data...
Progress: 60% - Reading personal data...
Progress: 100% - Complete
```

#### Test 11: Features NOT Implemented

1. **Passport Reading**:
   ```javascript
   await EIDReader.readPassport(mrzKey)
   ```
   **Rezultat:** Error "NOT_IMPLEMENTED"

2. **MRZ Scanning**:
   ```javascript
   await EIDReader.startMRZScanning()
   ```
   **Rezultat:** Error "NOT_IMPLEMENTED"

3. **OCR Scanning**:
   ```javascript
   await EIDReader.startOCRScanning()
   ```
   **Rezultat:** Error "NOT_IMPLEMENTED"

### 8. Debugging

#### Enable Logcat Filtering

```bash
# Vezi doar logs relevante
adb logcat -v time | grep -E "RNRomanianEIDSDK|EIDReader|ReactNative"

# Clear logs înainte de test
adb logcat -c

# Vezi toate logs SDK
adb logcat *:S RNRomanianEIDSDK:D EIDReader:D
```

#### React Native Debugger

1. Shake device (sau Cmd+M în emulator)
2. Select **"Debug"**
3. Deschide Chrome DevTools
4. Vezi console pentru JavaScript errors

#### Verifică Native Module Linking

```bash
# Verifică că modulul este înregistrat
adb shell dumpsys package | grep eidromania
```

### 9. Testare pe Emulator

**⚠️ IMPORTANT:** NFC **NU** funcționează pe emulatoare Android! Trebuie să testezi pe **dispozitiv fizic**.

Dar poți testa alte funcții:
- ✅ SDK initialization
- ✅ License validation
- ✅ UI components
- ✅ Input validation
- ❌ NFC card reading (necesită hardware)

### 10. Common Issues & Solutions

#### Issue 1: "NFC not available"

**Cauze:**
- NFC dezactivat în setări
- Telefon fără NFC hardware
- Aplicația nu are permisiuni NFC

**Soluție:**
1. Activează NFC în Settings
2. Verifică AndroidManifest.xml
3. Restart aplicația

#### Issue 2: "SDK failed to initialize"

**Cauze:**
- Licență invalidă/expirată
- Bundle ID greșit în licență

**Soluție:**
1. Verifică `demo_license.jwt`
2. Verifică `applicationId` în `build.gradle`
3. Check logcat pentru detalii

#### Issue 3: "Cannot find module 'react-native-romanian-eid-sdk'"

**Soluție:**
```bash
cd react-native/example
rm -rf node_modules
npm install
cd android
./gradlew clean
cd ..
npm run android
```

#### Issue 4: Gradle build fails

**Soluție:**
```bash
cd react-native/example/android
./gradlew clean
./gradlew build --refresh-dependencies
```

#### Issue 5: "Tag was lost" imediat

**Cauze:**
- Card prea departe
- Carcasă metalică pe telefon
- NFC antena blocată

**Soluție:**
1. Scoate carcasa telefonului
2. Plasează cardul pe centrul spatelui
3. Ține ferm 10 secunde

### 11. Performance Testing

#### Măsoară timpul de citire:

```javascript
const startTime = Date.now();

EIDReader.readIDCard(can, pin, options)
  .then(result => {
    const duration = Date.now() - startTime;
    console.log(`Read completed in ${duration}ms`);
  });
```

**Timpul așteptat:**
- ⏱️ Total: 8-15 secunde
- 📡 NFC detection: 1-3s
- 🔐 Authentication: 2-4s
- 📄 Data reading: 3-6s
- 🖼️ Image processing: 2-3s

### 12. Memory Testing

```bash
# Monitorizează memoria
adb shell dumpsys meminfo com.eidtestapp | grep TOTAL

# Rulează citiri multiple și verifică memory leaks
```

**Limite așteptate:**
- Heap size: < 100MB
- Native heap: < 50MB
- Images: < 1MB (300KB per image, base64 encoded)

## ✅ Checklist Final

Înainte de a considera testarea completă:

- [ ] SDK se inițializează corect
- [ ] Licența este validată
- [ ] NFC este detectat
- [ ] Input validation funcționează (CAN/PIN)
- [ ] Card reading reușește (happy path)
- [ ] Progress events sunt emise
- [ ] Datele sunt afișate corect (CNP, nume, etc.)
- [ ] Imaginile sunt afișate (foto, semnătură)
- [ ] Error handling funcționează (CAN greșit, PIN greșit, tag lost)
- [ ] Timeout-urile funcționează
- [ ] NOT_IMPLEMENTED errors pentru passport/MRZ/OCR
- [ ] Performance este acceptabil (< 15s)
- [ ] Nu sunt memory leaks

## 📊 Raportare Rezultate

După testare, documentează:

1. **Device testat:**
   - Model: _______
   - Android Version: _______
   - NFC Support: Yes/No

2. **Test results:**
   - ✅ Tests passed: ___ / 11
   - ❌ Tests failed: ___ / 11
   - ⏱️ Average read time: ___ seconds

3. **Issues găsite:**
   - Descrie orice probleme
   - Include logs relevante
   - Screenshots dacă e posibil

## 🆘 Support

Dacă întâmpini probleme:

1. Verifică logs: `adb logcat | grep RNRomanianEIDSDK`
2. Clean build: `./gradlew clean`
3. Reinstall app: `npm run android -- --reset-cache`
4. Contact: office@up2date.ro

---

**Succes la testare! 🚀**
