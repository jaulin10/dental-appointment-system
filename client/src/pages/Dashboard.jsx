import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const Dashboard = () => {
  const navigate = useNavigate()
  const [userType, setUserType] = useState(null)
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    // Check if token exists, else redirect to login
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    try {
      const decoded = jwtDecode(token)
      setUserType(decoded.userType)
    } catch {
      localStorage.removeItem('token')
      navigate('/login')
      return
    }

    // Fetch appointments
    const fetchAppointments = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/appointments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (res.ok) {
          setAppointments(data.appointments)
        } else {
          alert(data.message || 'Failed to load appointments')
        }
      } catch (error) {
        console.error('Failed to fetch appointments:', error)
        alert('Failed to load appointments')
      }
    }

    fetchAppointments()
  }, [navigate])

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?'))
      return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:3000/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (res.ok) {
        setAppointments((prev) => prev.filter((appt) => appt._id !== id))
        alert('Appointment deleted')
      } else {
        alert(data.message || 'Failed to delete appointment')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting appointment')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/appointment')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Appointment
          </button>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <h2 className="text-xl mb-6">Registered Appointments</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Patient</th>
            <th className="border p-2">Dentist</th>
            <th className="border p-2">Date & Time</th>
            <th className="border p-2">Reason</th>
            {(userType === 'admin' || userType === 'dentist') && (
              <th className="border p-2">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt._id} className="text-center border-t border-gray-300">
              <td className="border p-2">{appt.patientId?.name || 'N/A'}</td>
              <td className="border p-2">{appt.dentistId?.name || 'N/A'}</td>
              <td className="border p-2">
                {new Date(appt.appointmentDate).toLocaleString()}
              </td>
              <td className="border p-2">{appt.reason || '-'}</td>
              {(userType === 'admin' || userType === 'dentist') && (
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleDelete(appt._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr>
              <td
                colSpan={userType === 'admin' || userType === 'dentist' ? 5 : 4}
                className="p-4"
              >
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard
