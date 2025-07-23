const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    duration: { type: Number, required: true }, // in minutes
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Preventive", "Restorative", "Cosmetic", "Other"],
      default: "Other",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
