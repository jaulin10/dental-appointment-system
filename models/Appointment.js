const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    dentistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dentist",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:MM format
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
      max: 240, // 4 hours max
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show", "rescheduled"],
      default: "scheduled",
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    reason: {
      type: String,
      required: true,
      maxlength: 500,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
appointmentSchema.index({ appointmentDate: 1, dentistId: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: 1 });

// Virtual for formatted appointment datetime
appointmentSchema.virtual("formattedDateTime").get(function () {
  const date = this.appointmentDate.toISOString().split("T")[0];
  return `${date} ${this.appointmentTime}`;
});

// Pre-save middleware to validate appointment time doesn't conflict
appointmentSchema.pre("save", async function (next) {
  if (
    this.isNew ||
    this.isModified("appointmentDate") ||
    this.isModified("appointmentTime") ||
    this.isModified("dentistId")
  ) {
    const conflictingAppointment = await this.constructor.findOne({
      _id: { $ne: this._id },
      dentistId: this.dentistId,
      appointmentDate: this.appointmentDate,
      appointmentTime: this.appointmentTime,
      status: { $in: ["scheduled", "rescheduled"] },
    });

    if (conflictingAppointment) {
      throw new Error(
        "This time slot is already booked for the selected dentist"
      );
    }
  }
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);
