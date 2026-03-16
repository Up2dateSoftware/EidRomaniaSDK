# Android Implementation - COMPLETED ✅

## Overview

~~Acest document conținea instrucțiuni detaliate pentru implementarea părții Android a React Native bridge-ului.~~

**UPDATE (Nov 14, 2025): Implementarea Android bridge este COMPLETĂ și funcțională!**

## Status Current

✅ **COMPLETAT:**
- ✅ Structură de foldere Android
- ✅ `RNRomanianEIDSDKModule.java` - **COMPLET IMPLEMENTAT**
- ✅ Package configuration (`RNRomanianEIDSDKPackage.java`)
- ✅ Android Manifest cu permisiuni NFC și cameră
- ✅ Gradle build configuration cu dependencies
- ✅ Integrare completă cu eID Romania SDK nativ
- ✅ SDK initialization cu validare licență JWT
- ✅ Citire CI electronică (PACE cu CAN+PIN) - **FUNCȚIONAL**
- ✅ Progress event emission către JavaScript
- ✅ Error handling cu mesaje user-friendly în română
- ✅ Conversie date card → JavaScript object
- ✅ Base64 encoding pentru imagini biometrice
- ✅ NFC availability detection
- ✅ License status checking
- ✅ Documentație completă (README.md)

⏳ **Nu Încă Implementat (necesită suport în SDK-ul nativ):**
- Citire pasaport NFC (BAC/PACE) - SDK nativ nu suportă încă
- MRZ scanning cu camera - SDK nativ nu suportă încă
- OCR scanning cu ML Kit - SDK nativ nu suportă încă

> **Notă**: Aceste features vor fi implementate automat când SDK-ul nativ Android va adăuga suportul pentru ele.

---

## 1. Dependințe Necesare

Adaugă în `android/build.gradle`:

```gradle
dependencies {
    implementation 'com.facebook.react:react-native:+'

    // JMRTD pentru citire documente NFC
    implementation 'org.jmrtd:jmrtd:0.7.34'

    // BouncyCastle pentru crypto (BAC/PACE)
    implementation 'com.madgag.spongycastle:prov:1.58.0.0'
    implementation 'com.madgag.spongycastle:core:1.58.0.0'
    implementation 'com.madgag.spongycastle:pkix:1.58.0.0'

    // SCUBA pentru smart card
    implementation 'net.sf.scuba:scuba-sc-android:0.0.23'

    // Google ML Kit pentru OCR
    implementation 'com.google.mlkit:text-recognition:16.0.0'

    // JWT parsing pentru licență
    implementation 'com.auth0.android:jwtdecode:2.0.1'

    // Camera X pentru MRZ/OCR scanning
    implementation 'androidx.camera:camera-camera2:1.2.0'
    implementation 'androidx.camera:camera-lifecycle:1.2.0'
    implementation 'androidx.camera:camera-view:1.2.0'
}
```

---

## 2. Validare Licență JWT

### Fișier: `RNRomanianEIDSDKModule.java` → `initialize()`

**Ce trebuie să faci:**

1. Parse JWT-ul folosind `jwtdecode`
2. Verifică signature (HMAC-SHA256)
3. Verifică claims obligatorii:
   - `sub`: Issued to (nume client)
   - `iat`: Issued at (timestamp)
   - `exp`: Expiry (timestamp) - verifică că nu e expirat
   - `bundle_id`: Bundle ID Android (e.g., `com.yourapp`)
   - `features`: Array cu features licențiate (e.g., `["passportReading", "idCardReading", "ocrScanning"]`)
   - `tier`: License tier (e.g., `"commercial"`, `"trial"`)

4. Salvează licența validată în SharedPreferences:
```java
SharedPreferences prefs = reactContext.getSharedPreferences("RomanianEIDSDK", Context.MODE_PRIVATE);
prefs.edit()
    .putString("license_jwt", license)
    .putBoolean("license_valid", true)
    .putLong("license_expiry", expiryTimestamp)
    .apply();
```

**Exemplu de validare:**

```java
@ReactMethod
public void initialize(String license, Promise promise) {
    try {
        JWT jwt = new JWT(license);

        // Verifică expiry
        if (jwt.isExpired(0)) {
            promise.reject("LICENSE_EXPIRED", "License has expired");
            return;
        }

        // Verifică bundle ID
        String bundleId = jwt.getClaim("bundle_id").asString();
        String appId = reactContext.getPackageName();
        if (!bundleId.equals(appId)) {
            promise.reject("BUNDLE_ID_MISMATCH", "License not valid for this app");
            return;
        }

        // Extract features
        List<String> features = jwt.getClaim("features").asList(String.class);

        // Salvează în SharedPreferences
        // ...

        promise.resolve(true);
    } catch (Exception e) {
        promise.reject("INIT_ERROR", "Failed to initialize: " + e.getMessage(), e);
    }
}
```

---

## 3. Citire Pasaport NFC (BAC)

### Fișier: `RNRomanianEIDSDKModule.java` → `readPassport()`

**Ce trebuie să faci:**

1. **Parse MRZ Key:**
   - Format: `DocumentNumber + DateOfBirth + DateOfExpiry` (cu check digits)
   - Exemplu: `RO1234567<8950101<19301015<`

2. **Start NFC Session:**
```java
NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext);
PendingIntent pendingIntent = PendingIntent.getActivity(...);
nfcAdapter.enableForegroundDispatch(activity, pendingIntent, ...);
```

3. **Citește TAG NFC:**
```java
public void onNewIntent(Intent intent) {
    Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
    IsoDep isoDep = IsoDep.get(tag);
    isoDep.connect();

    // Create PassportService
    PassportService passportService = new PassportService(
        new CardService(isoDep),
        PassportService.NORMAL_MAX_TRANCEIVE_LENGTH,
        PassportService.DEFAULT_MAX_BLOCKSIZE,
        false, // isSFIEnabled
        false  // shouldCheckMAC
    );

    // Open connection
    passportService.open();

    // Perform BAC authentication
    BACKeySpec bacKey = new BACKeySpec(documentNumber, dateOfBirth, dateOfExpiry);
    passportService.doBAC(bacKey);

    // Read data groups
    // DG1 = MRZ
    // DG2 = Facial image
    // DG11 = Additional details
    // DG15 = Active authentication public key
}
```

4. **Parse Data Groups:**
```java
// DG1 - MRZ
InputStream dg1Stream = passportService.getInputStream(PassportService.EF_DG1);
DG1File dg1 = new DG1File(dg1Stream);
MRZInfo mrzInfo = dg1.getMRZInfo();

// DG2 - Photo
InputStream dg2Stream = passportService.getInputStream(PassportService.EF_DG2);
DG2File dg2 = new DG2File(dg2Stream);
List<FaceImageInfo> faceImages = dg2.getFaceInfos();
byte[] photoBytes = faceImages.get(0).getImageBytes();

// DG11 - Additional personal details
InputStream dg11Stream = passportService.getInputStream(PassportService.EF_DG11);
DG11File dg11 = new DG11File(dg11Stream);
String cnp = dg11.getPersonalNumber();
String placeOfBirth = dg11.getPlaceOfBirth();
```

5. **Validare CSCA (opțional):**
```java
// Read SOD (Security Object)
InputStream sodStream = passportService.getInputStream(PassportService.EF_SOD);
SODFile sod = new SODFile(sodStream);

// Verify signature cu CSCA certificate
// ... implementare validare CSCA
```

6. **Return Result:**
```java
WritableMap result = Arguments.createMap();
result.putBoolean("success", true);
result.putString("documentNumber", mrzInfo.getDocumentNumber());
result.putString("fullName", mrzInfo.getPrimaryIdentifier() + " " + mrzInfo.getSecondaryIdentifier());
result.putString("dateOfBirth", formatDate(mrzInfo.getDateOfBirth()));
result.putString("nationality", mrzInfo.getNationality());
result.putString("sex", mrzInfo.getGender().toString());
result.putString("dateOfExpiry", formatDate(mrzInfo.getDateOfExpiry()));
result.putString("cnp", cnp);
result.putString("placeOfBirth", placeOfBirth);
result.putString("facialImageBase64", bytesToBase64(photoBytes));
result.putBoolean("cscaValidated", cscaValid);

promise.resolve(result);
```

**Referințe:**
- JMRTD Documentation: https://jmrtd.org/
- Sample code: https://github.com/tananaev/passport-reader

---

## 4. Citire CI Electronică (PACE)

### Fișier: `RNRomanianEIDSDKModule.java` → `readIDCard()`

**Ce trebuie să faci:**

1. **Validare CAN și PIN:**
   - CAN: 6 cifre
   - PIN: 4-8 cifre

2. **PACE Authentication:**
```java
// Establish PACE channel cu CAN
PACEKeySpec paceKey = new PACEKeySpec(can, PACEKeySpec.PaceKeyType.CAN);
passportService.doPACE(paceKey);

// Verify PIN
// ... PIN verification step
```

3. **Citire Date Personale:**
   - Citește fișiere din chip (similar cu pasaport)
   - Parse date specifice CI românești
   - Extrage: CNP, nume, adrese (permanentă, temporară, străinătate)

4. **Extragere Biometrice:**
   - Foto: similar cu DG2 pasaport
   - Semnătură: specific CI românești

5. **Return Result:**
```java
WritableMap result = Arguments.createMap();
result.putBoolean("success", true);
result.putString("documentNumber", docNumber);
result.putString("cnp", cnp);
result.putString("fullName", fullName);
result.putString("permanentAddress", permanentAddress);
result.putString("facialImageBase64", bytesToBase64(photoBytes));
result.putString("signatureImageBase64", bytesToBase64(signatureBytes));
// ... alte câmpuri

promise.resolve(result);
```

**Note:**
- CI românești folosesc PACE în loc de BAC
- Structura fișierelor poate diferi de pașapoarte
- Consultă specificații tehnice ANSPDCP

---

## 5. MRZ Scanning cu Camera

### Fișier nou: `MRZScannerActivity.java`

**Ce trebuie să faci:**

1. **Camera View cu CameraX:**
```java
public class MRZScannerActivity extends AppCompatActivity {
    private ProcessCameraProvider cameraProvider;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Setup camera preview
        // Setup image analysis pentru MRZ detection
    }

    private void analyzeImage(ImageProxy image) {
        // Convertește imagine în bitmap
        // Rulează text recognition
        // Caută pattern MRZ (2 linii × 44 caractere)
        // Parse și validează MRZ
    }
}
```

2. **MRZ Parsing:**
```java
public class MRZParser {
    public static MRZInfo parse(String line1, String line2) {
        // Line 1: P<ROUTING>SURNAME<<GIVENNAMES<<<...
        // Line 2: DOCNUMBER<NATIONALITY<DOB<SEX<EXPIRY<PERSONAL<<<

        // Extrage câmpuri
        String documentNumber = line2.substring(0, 9).replace("<", "");
        String nationality = line2.substring(10, 13);
        String dob = line2.substring(13, 19);
        String sex = line2.substring(20, 21);
        String expiry = line2.substring(21, 27);

        // Validează check digits
        // ...

        // Generează MRZ key pentru BAC
        String mrzKey = documentNumber + dob + expiry; // cu check digits

        return new MRZInfo(documentNumber, nationality, dob, sex, expiry, mrzKey);
    }
}
```

3. **Return Result la React Native:**
```java
WritableMap result = Arguments.createMap();
result.putString("documentType", "P");
result.putString("issuingCountry", "ROU");
result.putString("documentNumber", documentNumber);
result.putString("surname", surname);
result.putString("givenNames", givenNames);
result.putString("nationality", nationality);
result.putString("sex", sex);
result.putString("dateOfBirth", dob);
result.putString("dateOfExpiry", expiry);
result.putString("fullMRZ", line1 + "\n" + line2);
result.putString("mrzKey", mrzKey);

promise.resolve(result);
```

---

## 6. OCR Scanning cu ML Kit

### Fișier nou: `OCRScannerActivity.java`

**Ce trebuie să faci:**

1. **Setup Google ML Kit:**
```java
TextRecognizer recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);

recognizer.process(inputImage)
    .addOnSuccessListener(visionText -> {
        // Process recognized text
        String fullText = visionText.getText();

        // Parse câmpuri CI
        Map<String, String> extractedData = parseIDCardText(fullText);

        // Calculează confidence score
        float confidence = calculateConfidence(extractedData);

        // Validează date
        List<String> issues = validateExtractedData(extractedData);

        // Return result
    });
```

2. **Parse Text pentru CI Română:**
```java
private Map<String, String> parseIDCardText(String text) {
    Map<String, String> data = new HashMap<>();

    // Extract CNP (13 cifre)
    Pattern cnpPattern = Pattern.compile("\\b[1-9]\\d{12}\\b");
    Matcher cnpMatcher = cnpPattern.matcher(text);
    if (cnpMatcher.find()) {
        data.put("cnp", cnpMatcher.group());
    }

    // Extract document number (e.g., "RO123456")
    Pattern docPattern = Pattern.compile("\\b[A-Z]{2}\\d{6}\\b");
    // ...

    // Extract nume (căutare după cuvinte cheie: "Nume", "Prenume")
    // ...

    // Extract adresă (căutare după "Domiciliu", "Str.", "Nr.", etc.)
    // ...

    return data;
}
```

3. **Validare și Confidence:**
```java
private float calculateConfidence(Map<String, String> data) {
    int totalFields = 10;
    int extractedFields = data.size();

    // Validări specifice
    boolean cnpValid = validateCNP(data.get("cnp"));
    boolean dateValid = validateDate(data.get("dateOfBirth"));

    float confidence = (float) extractedFields / totalFields;
    if (cnpValid) confidence += 0.2f;
    if (dateValid) confidence += 0.1f;

    return Math.min(confidence, 1.0f);
}

private boolean validateCNP(String cnp) {
    if (cnp == null || cnp.length() != 13) return false;
    // Validare check digit CNP
    // ...
    return true;
}
```

4. **Return Result:**
```java
WritableMap result = Arguments.createMap();
result.putBoolean("success", true);
result.putString("documentNumber", data.get("documentNumber"));
result.putString("cnp", data.get("cnp"));
result.putString("fullName", data.get("fullName"));
result.putString("dateOfBirth", data.get("dateOfBirth"));
result.putString("sex", data.get("sex"));
result.putString("permanentAddress", data.get("permanentAddress"));
result.putFloat("confidence", confidence);
result.putBoolean("isReliable", confidence >= 0.8f);
result.putString("rawText", fullText);
// result.putArray("validationIssues", issues);

promise.resolve(result);
```

---

## 7. Event Emitters (Progress Updates)

Pentru a trimite progres la React Native în timp real:

```java
private void sendProgressEvent(String message, float progress) {
    WritableMap params = Arguments.createMap();
    params.putString("message", message);
    params.putInt("percentage", (int)(progress * 100));

    sendEvent("onReadProgress", params);
}

// Usage:
sendProgressEvent("Connecting to card...", 0.1f);
sendProgressEvent("Authenticating...", 0.3f);
sendProgressEvent("Reading data groups...", 0.5f);
sendProgressEvent("Extracting biometrics...", 0.8f);
sendProgressEvent("Complete!", 1.0f);
```

---

## 8. Testing

### Test Cases:

1. **License Validation:**
   - ✅ Valid license
   - ❌ Expired license
   - ❌ Wrong bundle ID
   - ❌ Invalid signature

2. **Passport Reading:**
   - ✅ Valid Romanian passport
   - ❌ Invalid MRZ key
   - ❌ Connection timeout
   - ❌ User cancels

3. **ID Card Reading:**
   - ✅ Valid CI with correct CAN/PIN
   - ❌ Wrong CAN
   - ❌ Wrong PIN
   - ❌ Locked card (3 wrong PINs)

4. **OCR:**
   - ✅ Clear photo of CI
   - ❌ Blurry photo
   - ❌ Partial photo
   - ⚠️ Low confidence but extractable

---

## 9. Resurse Utile

- **JMRTD:** https://jmrtd.org/
- **ICAO 9303:** https://www.icao.int/publications/pages/publication.aspx?docnum=9303
- **Android NFC Guide:** https://developer.android.com/guide/topics/connectivity/nfc
- **ML Kit Text Recognition:** https://developers.google.com/ml-kit/vision/text-recognition/android
- **Sample Passport Reader:** https://github.com/tananaev/passport-reader

---

## Contact

Pentru întrebări sau asistență:
- Email: office@up2date.ro
- Întrebări despre structura de date: Verifică implementarea iOS în `RNRomanianEIDSDKBridge.swift`

---

**Succes cu implementarea! 🚀**
