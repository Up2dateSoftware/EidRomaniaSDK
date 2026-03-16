// Verifică câmpurile din rezultatul passport din log
const passportResult = {
  "cnp": "1870527460019",
  "nationality": "ROU",
  "dateOfBirth": "27.05.1987",
  "cscaValidationMessage": "Certificat valid",
  "cscaValidated": true
};

console.log("Câmpuri disponibile:", Object.keys(passportResult));
