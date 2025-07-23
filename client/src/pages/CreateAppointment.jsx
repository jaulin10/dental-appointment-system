import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAppointment } from '../api/appointments'
import axios from 'axios'

export default function CreateAppointment() {
  const [patients, setPatients] = useState([])
  const [dentists, setDentists] = useState([])
  const [services, setServices] = useState([])

  const [patientId, setPatientId] = useState('')
  const [dentistId, setDentistId] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsRes = await axios.get('/api/patients')
        const dentistsRes = await axios.get('/api/dentists')
        const servicesRes = await axios.get('/api/services')

        const patientsData = patientsRes.data.data || patientsRes.data
        const dentistsData = dentistsRes.data.data || dentistsRes.data
        const servicesData = servicesRes.data.data || servicesRes.data

        console.log(patientsRes.data)
        

        setPatients(Array.isArray(patientsData) ? patientsData : [])
        setDentists(Array.isArray(dentistsData) ? dentistsData : [])
        setServices(Array.isArray(servicesData) ? servicesData : [])
      } catch (err) {
        setError('Failed to load dropdown data. Please try again.')
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await createAppointment({
        patientId,
        dentistId,
        serviceId,
        appointmentDate,
        appointmentTime,
        reason,
        notes,
      })

      setSuccess('Appointment created successfully.')
      setTimeout(() => navigate('/appointments'), 1500)
    } catch (err) {
      setError('Failed to create appointment. Please check your inputs.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create Appointment
      </h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-600 mb-4 text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Select */}
        <div>
          <label className="block mb-1 font-medium">Patient:</label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Patient</option>
            {Array.isArray(patients) &&
              patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
          </select>
        </div>

        {/* Dentist Select */}
        <div>
          <label className="block mb-1 font-medium">Dentist:</label>
          <select
            value={dentistId}
            onChange={(e) => setDentistId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Dentist</option>
            {Array.isArray(dentists) &&
              dentists.map((d) => (
                <option key={d._id} value={d._id}>
                  Dr. {d.firstName} {d.lastName} ({d.specialization})
                </option>
              ))}
          </select>
        </div>

        {/* Service Select */}
        <div>
          <label className="block mb-1 font-medium">Service:</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Service</option>
            {Array.isArray(services) &&
              services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} (${s.price})
                </option>
              ))}
          </select>
        </div>

        {/* Appointment Date */}
        <div>
          <label className="block mb-1 font-medium">Appointment Date:</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Appointment Time */}
        <div>
          <label className="block mb-1 font-medium">Appointment Time:</label>
          <input
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block mb-1 font-medium">Reason:</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1 font-medium">Notes (Optional):</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Create Appointment
        </button>
      </form>
    </div>
  )
}
