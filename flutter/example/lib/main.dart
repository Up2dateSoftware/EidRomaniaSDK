import 'dart:async';
import 'package:flutter/material.dart';
import 'package:romanian_eid_sdk/romanian_eid_sdk.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Romanian eID SDK Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final RomanianEidSdk _sdk = RomanianEidSdk();

  bool _isInitialized = false;
  bool _isNfcAvailable = false;
  String _status = 'Not initialized';
  PassportData? _passportData;
  IDCardData? _idCardData;

  // Form controllers
  final _licenseKeyController = TextEditingController();
  final _documentNumberController = TextEditingController();
  final _dateOfBirthController = TextEditingController();
  final _dateOfExpiryController = TextEditingController();
  final _canController = TextEditingController();

  StreamSubscription<ReadingProgress>? _progressSubscription;

  @override
  void initState() {
    super.initState();
    _checkNfcAvailability();
  }

  @override
  void dispose() {
    _progressSubscription?.cancel();
    _licenseKeyController.dispose();
    _documentNumberController.dispose();
    _dateOfBirthController.dispose();
    _dateOfExpiryController.dispose();
    _canController.dispose();
    super.dispose();
  }

  Future<void> _checkNfcAvailability() async {
    final available = await _sdk.isNfcAvailable();
    setState(() {
      _isNfcAvailable = available;
      _status = available ? 'NFC available' : 'NFC not available';
    });
  }

  Future<void> _initialize() async {
    final licenseKey = _licenseKeyController.text.trim();
    if (licenseKey.isEmpty) {
      _showError('Please enter a license key');
      return;
    }

    setState(() => _status = 'Initializing...');

    try {
      final success = await _sdk.initialize(licenseKey);
      setState(() {
        _isInitialized = success;
        _status = success ? 'Initialized successfully' : 'Initialization failed';
      });
    } catch (e) {
      _showError('Initialization error: $e');
    }
  }

  Future<void> _readPassport() async {
    final documentNumber = _documentNumberController.text.trim();
    final dateOfBirth = _dateOfBirthController.text.trim();
    final dateOfExpiry = _dateOfExpiryController.text.trim();

    if (documentNumber.isEmpty || dateOfBirth.isEmpty || dateOfExpiry.isEmpty) {
      _showError('Please fill all passport fields');
      return;
    }

    setState(() {
      _status = 'Reading passport...';
      _passportData = null;
    });

    // Listen to progress
    _progressSubscription?.cancel();
    _progressSubscription = _sdk.progressStream.listen((progress) {
      setState(() {
        _status = '${progress.step}: ${progress.message} (${(progress.progress * 100).toInt()}%)';
      });
    });

    try {
      final data = await _sdk.readPassport(
        documentNumber: documentNumber,
        dateOfBirth: dateOfBirth,
        dateOfExpiry: dateOfExpiry,
      );
      setState(() {
        _passportData = data;
        _status = 'Passport read successfully';
      });
    } catch (e) {
      _showError('Read error: $e');
    } finally {
      _progressSubscription?.cancel();
    }
  }

  Future<void> _readIDCard() async {
    final can = _canController.text.trim();

    if (can.isEmpty) {
      _showError('Please enter the CAN');
      return;
    }

    setState(() {
      _status = 'Reading ID card...';
      _idCardData = null;
    });

    // Listen to progress
    _progressSubscription?.cancel();
    _progressSubscription = _sdk.progressStream.listen((progress) {
      setState(() {
        _status = '${progress.step}: ${progress.message} (${(progress.progress * 100).toInt()}%)';
      });
    });

    try {
      final data = await _sdk.readIDCard(can: can);
      setState(() {
        _idCardData = data;
        _status = 'ID card read successfully';
      });
    } catch (e) {
      _showError('Read error: $e');
    } finally {
      _progressSubscription?.cancel();
    }
  }

  void _showError(String message) {
    setState(() => _status = 'Error: $message');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Romanian eID SDK Demo'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Status card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          _isNfcAvailable ? Icons.nfc : Icons.nfc_rounded,
                          color: _isNfcAvailable ? Colors.green : Colors.red,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          _isNfcAvailable ? 'NFC Available' : 'NFC Not Available',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text('Status: $_status'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Initialization section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Initialize SDK',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _licenseKeyController,
                      decoration: const InputDecoration(
                        labelText: 'License Key',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: _initialize,
                      child: const Text('Initialize'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Passport reading section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Read Passport (BAC)',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _documentNumberController,
                      decoration: const InputDecoration(
                        labelText: 'Document Number',
                        hintText: 'e.g., 123456789',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _dateOfBirthController,
                      decoration: const InputDecoration(
                        labelText: 'Date of Birth (YYMMDD)',
                        hintText: 'e.g., 901231',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _dateOfExpiryController,
                      decoration: const InputDecoration(
                        labelText: 'Date of Expiry (YYMMDD)',
                        hintText: 'e.g., 301231',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: _isInitialized ? _readPassport : null,
                      child: const Text('Read Passport'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // ID card reading section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Read ID Card (PACE)',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _canController,
                      decoration: const InputDecoration(
                        labelText: 'CAN (Card Access Number)',
                        hintText: 'e.g., 123456',
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: _isInitialized ? _readIDCard : null,
                      child: const Text('Read ID Card'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Results section
            if (_passportData != null)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Passport Data',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      _buildDataRow('Name', '${_passportData!.firstName} ${_passportData!.lastName}'),
                      _buildDataRow('Document Number', _passportData!.documentNumber ?? '-'),
                      _buildDataRow('Nationality', _passportData!.nationality ?? '-'),
                      _buildDataRow('Date of Birth', _passportData!.dateOfBirth ?? '-'),
                      _buildDataRow('Date of Expiry', _passportData!.dateOfExpiry ?? '-'),
                      _buildDataRow('Gender', _passportData!.gender ?? '-'),
                    ],
                  ),
                ),
              ),

            if (_idCardData != null)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'ID Card Data',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      _buildDataRow('Name', '${_idCardData!.firstName} ${_idCardData!.lastName}'),
                      _buildDataRow('CNP', _idCardData!.cnp ?? '-'),
                      _buildDataRow('Document Number', _idCardData!.documentNumber ?? '-'),
                      _buildDataRow('Address', _idCardData!.address ?? '-'),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildDataRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
