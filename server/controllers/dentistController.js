const Dentist = require("../models/Dentist");

// CREATE
exports.createDentist = async (req, res) => {
  try {
    const dentist = new Dentist(req.body);
    await dentist.save();
    res.status(201).json({ message: "Dentist created", dentist });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating dentist", error: err.message });
  }
};

// READ ALL
exports.getAllDentists = async (req, res) => {
  try {
    const dentists = await Dentist.find();
    res.json(dentists);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching dentists", error: err.message });
  }
};

// READ BY ID
exports.getDentistById = async (req, res) => {
  try {
    const dentist = await Dentist.findById(req.params.id);
    if (!dentist) return res.status(404).json({ message: "Dentist not found" });
    res.json(dentist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching dentist", error: err.message });
  }
};

// UPDATE
exports.updateDentist = async (req, res) => {
  try {
    const updated = await Dentist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Dentist updated", dentist: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating dentist", error: err.message });
  }
};

// DELETE
exports.deleteDentist = async (req, res) => {
  try {
    await Dentist.findByIdAndDelete(req.params.id);
    res.json({ message: "Dentist deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting dentist", error: err.message });
  }
};
