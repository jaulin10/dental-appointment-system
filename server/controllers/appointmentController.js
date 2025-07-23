const Appointment = require("../models/Appointment");
const Patient = require("../models/patient");
const Dentist = require("../models/Dentist");
const Service = require("../models/Service");
const { validationResult } = require("express-validator");
const moment = require("moment");

// CREATE - Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      patientId,
      dentistId,
      serviceId,
      appointmentDate,
      appointmentTime,
      reason,
      notes,
    } = req.body;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Verify dentist exists
    const dentist = await Dentist.findById(dentistId);
    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check if appointment date is in the future
    const appointmentDateTime = moment(
      `${appointmentDate} ${appointmentTime}`,
      "YYYY-MM-DD HH:mm"
    );
    if (appointmentDateTime.isBefore(moment())) {
      return res.status(400).json({
        message: "Appointment must be scheduled for a future date and time",
      });
    }

    const appointment = new Appointment({
      patientId,
      dentistId,
      serviceId,
      appointmentDate,
      appointmentTime,
      duration: service.duration,
      reason,
      notes,
      createdBy: req.user.id,
    });

    await appointment.save();

    // Populate the appointment with related data
    await appointment.populate([
      { path: "patientId", select: "firstName lastName email phone" },
      { path: "dentistId", select: "firstName lastName specialization" },
      { path: "serviceId", select: "name duration price" },
    ]);

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

// READ - Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.dentistId) filter.dentistId = req.query.dentistId;
    if (req.query.patientId) filter.patientId = req.query.patientId;
    if (req.query.date) {
      const date = new Date(req.query.date);
      filter.appointmentDate = {
        $gte: date,
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    const appointments = await Appointment.find(filter)
      .populate("patientId", "firstName lastName email phone")
      .populate("dentistId", "firstName lastName specialization")
      .populate("serviceId", "name duration price")
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(filter);

    res.json({
      appointments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAppointments: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// READ - Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "firstName lastName email phone dateOfBirth")
      .populate("dentistId", "firstName lastName specialization")
      .populate("serviceId", "name description duration price")
      .populate("createdBy", "firstName lastName email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({
      message: "Error fetching appointment",
      error: error.message,
    });
  }
};

// UPDATE - Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if appointment can be updated (not completed or cancelled)
    if (appointment.status === "completed") {
      return res
        .status(400)
        .json({ message: "Cannot update completed appointment" });
    }

    // If rescheduling, check if new time is available
    if (req.body.appointmentDate || req.body.appointmentTime) {
      const newDate = req.body.appointmentDate || appointment.appointmentDate;
      const newTime = req.body.appointmentTime || appointment.appointmentTime;
      const dentistId = req.body.dentistId || appointment.dentistId;

      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: appointment._id },
        dentistId: dentistId,
        appointmentDate: newDate,
        appointmentTime: newTime,
        status: { $in: ["scheduled", "rescheduled"] },
      });

      if (conflictingAppointment) {
        return res
          .status(400)
          .json({ message: "This time slot is already booked" });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: "patientId", select: "firstName lastName email phone" },
      { path: "dentistId", select: "firstName lastName specialization" },
      { path: "serviceId", select: "name duration price" },
    ]);

    res.json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      message: "Error updating appointment",
      error: error.message,
    });
  }
};

// DELETE - Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if appointment can be deleted (not completed)
    if (appointment.status === "completed") {
      return res
        .status(400)
        .json({ message: "Cannot delete completed appointment" });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      message: "Error deleting appointment",
      error: error.message,
    });
  }
};

// ADDITIONAL - Get available time slots for a dentist on a specific date
exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const { dentistId, date } = req.query;

    if (!dentistId || !date) {
      return res
        .status(400)
        .json({ message: "Dentist ID and date are required" });
    }

    // Get dentist's working hours
    const dentist = await Dentist.findById(dentistId);
    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    // Get day of week
    const dayOfWeek = moment(date).format("dddd").toLowerCase();
    const workingHours = dentist.workingHours[dayOfWeek];

    if (!workingHours || !workingHours.start || !workingHours.end) {
      return res.json({ availableSlots: [] });
    }

    // Get existing appointments for this dentist on this date
    const existingAppointments = await Appointment.find({
      dentistId,
      appointmentDate: new Date(date),
      status: { $in: ["scheduled", "rescheduled"] },
    });

    // Generate available time slots
    const availableSlots = [];
    const startTime = moment(
      `${date} ${workingHours.start}`,
      "YYYY-MM-DD HH:mm"
    );
    const endTime = moment(`${date} ${workingHours.end}`, "YYYY-MM-DD HH:mm");

    while (startTime.isBefore(endTime)) {
      const timeSlot = startTime.format("HH:mm");

      // Check if this time slot is available
      const isBooked = existingAppointments.some(
        (apt) => apt.appointmentTime === timeSlot
      );

      if (!isBooked) {
        availableSlots.push(timeSlot);
      }

      startTime.add(30, "minutes"); // 30-minute intervals
    }

    res.json({ availableSlots });
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    res.status(500).json({
      message: "Error fetching available time slots",
      error: error.message,
    });
  }
};
