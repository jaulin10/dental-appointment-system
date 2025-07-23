const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");

const registerValidation = [
  body("username").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
];

const loginValidation = [body("email").isEmail(), body("password").notEmpty()];

router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);

module.exports = router;
