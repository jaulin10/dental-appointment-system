import Appointment from '../models/appointment.model.js'

export const createAppointment = async (req, res) => {
  console.log('Received appointment data:', req.body)

  try {
    const newAppointment = new Appointment(req.body)
    await newAppointment.save()
    return res.status(201).json({
      success: true,
      message: 'Appointment created',
      appointment: newAppointment,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}


export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name')
      .populate('dentistId', 'name')

    res.status(200).json({ success: true, appointments })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params
    const appointment = await Appointment.findByIdAndDelete(id)

    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: 'Appointment not found' })

    res.json({ success: true, message: 'Appointment deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}