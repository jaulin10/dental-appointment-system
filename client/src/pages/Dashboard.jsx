import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Dashboard() {
  const [appointments, setAppointments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    api
      .get('/appointments')
      .then((res) => {
        setAppointments(res.data.appointments || [])
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          navigate('/login')
        }
      })
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <div>
          <Link
            to="/appointments/create"
            className="bg-green-600 text-white px-4 py-2 rounded mr-4 hover:bg-green-700"
          >
            Create Appointment
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Patient</th>
            <th className="border p-2">Dentist</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No appointments found.
              </td>
            </tr>
          ) : (
            appointments.map((apt) => (
              <tr key={apt._id}>
                <td className="border p-2">
                  {apt.patientId?.firstName
                    ? `${apt.patientId.firstName} ${
                        apt.patientId.lastName || ''
                      }`
                    : apt.patientId?.username || 'N/A'}
                </td>
                <td className="border p-2">
                  {apt.dentistId?.firstName
                    ? `${apt.dentistId.firstName} ${
                        apt.dentistId.lastName || ''
                      }`
                    : apt.dentistId?.username || 'N/A'}
                </td>
                <td className="border p-2">
                  {apt.appointmentDate
                    ? new Date(apt.appointmentDate).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="border p-2">{apt.appointmentTime || 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
