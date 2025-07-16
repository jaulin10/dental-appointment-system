const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const userController = require("../controllers/authController");

const userValidation = [
  body("username").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").isIn(["admin", "receptionist", "dentist"]),
];

router.post("/", auth, userValidation, userController.createUser);
router.get("/", auth, userController.getAllUsers);
router.get("/:id", auth, userController.getUserById);
router.put("/:id", auth, userValidation, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
