import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateAppointment = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    patientId: '',
    dentistId: '',
    date: '',
    time: '',
    description: '',
  })

  const [patients, setPatients] = useState([])
  const [dentists, setDentists] = useState([])

  // Fetch users and separate by role
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        const data = await res.json()

        if (res.ok) {
          const users = data.users
          const dentistList = users.filter(
            (user) => user.userType === 'dentist'
          )
          const patientList = users.filter(
            (user) => user.userType === 'patient'
          )

          setDentists(dentistList)
          setPatients(patientList)
        } else {
          alert(data.message || 'Failed to load users')
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        alert('Error fetching users')
      }
    }

    fetchUsers()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const appointmentDate = new Date(
      `${formData.date}T${formData.time}`
    ).toISOString()

    const payload = {
      patientId: formData.patientId,
      dentistId: formData.dentistId,
      appointmentDate,
      reason: formData.description,
    }

    try {
      const res = await fetch('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        alert('Appointment created successfully!')
        setFormData({
          patientId: '',
          dentistId: '',
          date: '',
          time: '',
          description: '',
        })
      } else {
        alert(data.message || 'Failed to create appointment')
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      alert('Error creating appointment')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Appointment</h2>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Patient dropdown */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Select Patient</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          >
            <option value="">-- Select Patient --</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dentist dropdown */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Select Dentist</label>
          <select
            name="dentistId"
            value={formData.dentistId}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          >
            <option value="">-- Select Dentist --</option>
            {dentists.map((dentist) => (
              <option key={dentist._id} value={dentist._id}>
                {dentist.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date, Time, Description */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Create Appointment
        </button>
      </form>
    </div>
  )
}

export default CreateAppointment
