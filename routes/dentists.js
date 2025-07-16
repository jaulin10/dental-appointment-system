const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const dentistController = require("../controllers/dentistController");

const dentistValidation = [
  body("firstName").trim().notEmpty(),
  body("lastName").trim().notEmpty(),
  body("email").isEmail(),
  body("phone").notEmpty(),
  body("specialization").notEmpty(),
  body("licenseNumber").notEmpty(),
];

router.post("/", auth, dentistValidation, dentistController.createDentist);
router.get("/", auth, dentistController.getAllDentists);
router.get("/:id", auth, dentistController.getDentistById);
router.put("/:id", auth, dentistValidation, dentistController.updateDentist);
router.delete("/:id", auth, dentistController.deleteDentist);

module.exports = router;
