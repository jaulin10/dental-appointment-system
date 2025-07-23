import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [appointments, setAppointments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }

    api
      .get('/appointments')
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Appointments</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded mb-4"
        >
          Logout
        </button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Patient</th>
            <th className="border p-2">Dentist</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt._id}>
              <td className="border p-2">{apt.patientId}</td>
              <td className="border p-2">{apt.dentistId}</td>
              <td className="border p-2">
                {new Date(apt.date).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
