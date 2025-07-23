const { body } = require("express-validator");

// Validation pour l'inscription
exports.validateRegister = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validation pour la connexion
exports.validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.validateAppointment = [
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('dentistId').notEmpty().withMessage('Dentist ID is required'),
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('appointmentDate')
    .notEmpty()
    .withMessage('Appointment date is required'),
  body('appointmentTime')
    .notEmpty()
    .withMessage('Appointment time is required'),
  body('reason')
    .notEmpty()
    .withMessage('Reason for appointment is required')
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),
]