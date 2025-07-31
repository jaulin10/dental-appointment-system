import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './database/connectDB.js'

import {
  registerUser,
  loginUser,
  getUsers,
} from './controllers/user.controller.js'
import {
  createAppointment,
  getAppointments,
  deleteAppointment,
} from './controllers/appointment.controller.js'

const app = express()
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: 'http://localhost:5173', // React dev server origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // allowed methods
    credentials: true, // if you need cookies or auth headers
  })
)

app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server running' })
})

app.post('/api/register', registerUser)
app.post('/api/login', loginUser)
app.get('/api/users', getUsers)
app.post('/api/appointments', createAppointment)
app.get('/api/appointments', getAppointments)
app.delete('/api/appointments/:id', deleteAppointment)



const startServer = () => {
  try {
    app.listen(port, async () => {
      await connectDB()
      console.log(`Server is listening to port ${port}...`)
    })
  } catch (error) {}
}

startServer()
