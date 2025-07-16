const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      required: true,
      match: /^[\+]?[\d\s\-\(\)]{10,}$/,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
        maxlength: 100,
      },
      city: {
        type: String,
        required: true,
        maxlength: 50,
      },
      province: {
        type: String,
        required: true,
        maxlength: 50,
      },
      postalCode: {
        type: String,
        required: true,
        match: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
      },
    },
    emergencyContact: {
      name: {
        type: String,
        required: true,
        maxlength: 100,
      },
      phone: {
        type: String,
        required: true,
        match: /^[\+]?[\d\s\-\(\)]{10,}$/,
      },
      relationship: {
        type: String,
        required: true,
        maxlength: 50,
      },
    },
    medicalHistory: [
      {
        type: String,
        maxlength: 200,
      },
    ],
    allergies: [
      {
        type: String,
        maxlength: 100,
      },
    ],
    insurance: {
      provider: {
        type: String,
        maxlength: 100,
      },
      policyNumber: {
        type: String,
        maxlength: 50,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
patientSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Index for efficient searching
patientSchema.index({ email: 1 });
patientSchema.index({ lastName: 1, firstName: 1 });

module.exports = mongoose.model("Patient", patientSchema);
