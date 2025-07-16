const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const serviceController = require("../controllers/serviceController");

const serviceValidation = [
  body("name").notEmpty().withMessage("Service name is required"),
  body("duration")
    .isInt({ min: 5 })
    .withMessage("Duration must be a number in minutes"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
];

router.post("/", auth, serviceValidation, serviceController.createService);
router.get("/", auth, serviceController.getAllServices);
router.get("/:id", auth, serviceController.getServiceById);
router.put("/:id", auth, serviceValidation, serviceController.updateService);
router.delete("/:id", auth, serviceController.deleteService);

module.exports = router;
