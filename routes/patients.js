const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const patientController = require("../controllers/patientController");

const patientValidation = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("dateOfBirth").isISO8601().withMessage("Valid birth date required"),
];

router.post("/", auth, patientValidation, patientController.createPatient);
router.get("/", auth, patientController.getAllPatients);
router.get("/:id", auth, patientController.getPatientById);
router.put("/:id", auth, patientValidation, patientController.updatePatient);
router.delete("/:id", auth, patientController.deletePatient);

module.exports = router;
