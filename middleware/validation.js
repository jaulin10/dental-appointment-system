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

// Validation pour les rendez-vous
exports.validateAppointment = [
  body("doctorId").notEmpty().withMessage("Doctor ID is required"),
  body("appointmentDate")
    .notEmpty()
    .withMessage("Appointment date is required"),
];
