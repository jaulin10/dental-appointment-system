const Patient = require("../models/patient");

// CREATE
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json({ message: "Patient created", patient });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating patient", error: err.message });
  }
};

// READ ALL
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching patients", error: err.message });
  }
};

// READ BY ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching patient", error: err.message });
  }
};

// UPDATE
exports.updatePatient = async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Patient updated", patient: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating patient", error: err.message });
  }
};

// DELETE
exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting patient", error: err.message });
  }
};
