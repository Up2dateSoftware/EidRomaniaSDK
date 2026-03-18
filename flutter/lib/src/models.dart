/// Data models for Romanian eID SDK.

/// Result from reading a passport via BAC protocol.
class PassportData {
  final String? documentNumber;
  final String? firstName;
  final String? lastName;
  final String? nationality;
  final String? dateOfBirth;
  final String? dateOfExpiry;
  final String? gender;
  final String? personalNumber;
  final String? issuingAuthority;
  final List<int>? faceImageBytes;

  PassportData({
    this.documentNumber,
    this.firstName,
    this.lastName,
    this.nationality,
    this.dateOfBirth,
    this.dateOfExpiry,
    this.gender,
    this.personalNumber,
    this.issuingAuthority,
    this.faceImageBytes,
  });

  factory PassportData.fromMap(Map<String, dynamic> map) {
    return PassportData(
      documentNumber: map['documentNumber'] as String?,
      firstName: map['firstName'] as String?,
      lastName: map['lastName'] as String?,
      nationality: map['nationality'] as String?,
      dateOfBirth: map['dateOfBirth'] as String?,
      dateOfExpiry: map['dateOfExpiry'] as String?,
      gender: map['gender'] as String?,
      personalNumber: map['personalNumber'] as String?,
      issuingAuthority: map['issuingAuthority'] as String?,
      faceImageBytes: map['faceImageBytes'] != null
          ? List<int>.from(map['faceImageBytes'])
          : null,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'documentNumber': documentNumber,
      'firstName': firstName,
      'lastName': lastName,
      'nationality': nationality,
      'dateOfBirth': dateOfBirth,
      'dateOfExpiry': dateOfExpiry,
      'gender': gender,
      'personalNumber': personalNumber,
      'issuingAuthority': issuingAuthority,
      'faceImageBytes': faceImageBytes,
    };
  }
}

/// Result from reading an ID card via PACE protocol.
class IDCardData {
  final String? cnp;
  final String? firstName;
  final String? lastName;
  final String? dateOfBirth;
  final String? placeOfBirth;
  final String? address;
  final String? issuedBy;
  final String? dateOfIssue;
  final String? dateOfExpiry;
  final String? cardNumber;
  final String? series;
  final List<int>? faceImageBytes;

  IDCardData({
    this.cnp,
    this.firstName,
    this.lastName,
    this.dateOfBirth,
    this.placeOfBirth,
    this.address,
    this.issuedBy,
    this.dateOfIssue,
    this.dateOfExpiry,
    this.cardNumber,
    this.series,
    this.faceImageBytes,
  });

  factory IDCardData.fromMap(Map<String, dynamic> map) {
    return IDCardData(
      cnp: map['cnp'] as String?,
      firstName: map['firstName'] as String?,
      lastName: map['lastName'] as String?,
      dateOfBirth: map['dateOfBirth'] as String?,
      placeOfBirth: map['placeOfBirth'] as String?,
      address: map['address'] as String?,
      issuedBy: map['issuedBy'] as String?,
      dateOfIssue: map['dateOfIssue'] as String?,
      dateOfExpiry: map['dateOfExpiry'] as String?,
      cardNumber: map['cardNumber'] as String?,
      series: map['series'] as String?,
      faceImageBytes: map['faceImageBytes'] != null
          ? List<int>.from(map['faceImageBytes'])
          : null,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'cnp': cnp,
      'firstName': firstName,
      'lastName': lastName,
      'dateOfBirth': dateOfBirth,
      'placeOfBirth': placeOfBirth,
      'address': address,
      'issuedBy': issuedBy,
      'dateOfIssue': dateOfIssue,
      'dateOfExpiry': dateOfExpiry,
      'cardNumber': cardNumber,
      'series': series,
      'faceImageBytes': faceImageBytes,
    };
  }
}

/// MRZ data extracted from OCR scanning.
class MRZData {
  final String? documentNumber;
  final String? dateOfBirth;
  final String? dateOfExpiry;

  MRZData({
    this.documentNumber,
    this.dateOfBirth,
    this.dateOfExpiry,
  });

  factory MRZData.fromMap(Map<String, dynamic> map) {
    return MRZData(
      documentNumber: map['documentNumber'] as String?,
      dateOfBirth: map['dateOfBirth'] as String?,
      dateOfExpiry: map['dateOfExpiry'] as String?,
    );
  }
}

/// Reading progress callback data.
class ReadingProgress {
  final String stage;
  final double progress;
  final String? message;

  ReadingProgress({
    required this.stage,
    required this.progress,
    this.message,
  });

  factory ReadingProgress.fromMap(Map<String, dynamic> map) {
    return ReadingProgress(
      stage: map['stage'] as String? ?? '',
      progress: (map['progress'] as num?)?.toDouble() ?? 0.0,
      message: map['message'] as String?,
    );
  }
}
