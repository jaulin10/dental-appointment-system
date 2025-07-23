const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    patientName: { type: String, required: true },
    dentistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dentist',
      required: true,
    },
    dentistName: { type: String, required: true },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    serviceName: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: {
      type: String,
      required: true,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    duration: { type: Number, required: true, min: 15, max: 240 },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show', 'rescheduled'],
      default: 'scheduled',
    },
    notes: { type: String, maxlength: 1000 },
    reason: { type: String, required: true, maxlength: 500 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Appointment', appointmentSchema)
