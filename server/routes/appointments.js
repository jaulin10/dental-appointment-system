const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const auth = require("../middleware/auth");
const appointmentController = require("../controllers/appointmentController");

// Validation middleware
const appointmentValidation = [
  body("patientId").isMongoId().withMessage("Valid patient ID is required"),
  body("dentistId").isMongoId().withMessage("Valid dentist ID is required"),
  body("serviceId").isMongoId().withMessage("Valid service ID is required"),
  body("appointmentDate")
    .isISO8601()
    .withMessage("Valid appointment date is required"),
  body("appointmentTime")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Valid time format (HH:MM) is required"),
  body("reason")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Reason is required and must be less than 500 characters"),
  body("notes")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Notes must be less than 1000 characters"),
];

// CRUD Routes
router.post(
  "/",
  auth,
  appointmentValidation,
  appointmentController.createAppointment
);
router.get("/", auth, appointmentController.getAllAppointments);
router.get(
  "/available-slots",
  auth,
  appointmentController.getAvailableTimeSlots
);
router.get("/:id", auth, appointmentController.getAppointmentById);
router.put(
  "/:id",
  auth,
  appointmentValidation,
  appointmentController.updateAppointment
);
router.delete("/:id", auth, appointmentController.deleteAppointment);

module.exports = router;
