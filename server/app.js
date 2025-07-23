const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const appointmentRoutes = require('./routes/appointments')
const patientRoutes = require('./routes/patients')
const dentistRoutes = require('./routes/dentists')
const serviceRoutes = require('./routes/services')

const Patient = require('./models/patient')
const Dentist = require('./models/Dentist')
const Service = require('./models/Service')

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

async function seedDatabase() {
  try {
    const patientCount = await Patient.countDocuments()
    if (patientCount === 0) {
      await Patient.insertMany([
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          dateOfBirth: new Date('1985-06-15'),
          address: {
            street: '123 Main St',
            city: 'Toronto',
            province: 'ON',
            postalCode: 'M1M 2N3',
          },
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '0987654321',
          },
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phone: '0987654321',
          dateOfBirth: new Date('1990-08-20'),
          address: {
            street: '456 Elm St',
            city: 'Scarborough',
            province: 'ON',
            postalCode: 'M4C 1A1',
          },
          emergencyContact: {
            name: 'John Smith',
            relationship: 'Brother',
            phone: '1234567890',
          },
        },
      ])
      console.log('Seeded patients')
    }

    const dentistCount = await Dentist.countDocuments()
    if (dentistCount === 0) {
      await Dentist.insertMany([
        {
          firstName: 'Emily',
          lastName: 'Brown',
          email: 'emily@dentist.com',
          specialization: 'Orthodontics',
          licenseNumber: 'ORTHO1234',
          phone: '555-123-4567',
        },
        {
          firstName: 'Mark',
          lastName: 'White',
          email: 'mark@dentist.com',
          specialization: 'Pediatric Dentistry',
          licenseNumber: 'PEDD5678',
          phone: '555-987-6543',
        },
      ])
      console.log('Seeded dentists')
    }

    const serviceCount = await Service.countDocuments()
    if (serviceCount === 0) {
      await Service.insertMany([
        { name: 'Cleaning', duration: 30, price: 50 },
        { name: 'Filling', duration: 60, price: 150 },
        { name: 'Whitening', duration: 45, price: 120 },
      ])
      console.log('Seeded services')
    }
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}



mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ Connected to MongoDB')
    await seedDatabase()
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err))

app.use('/api/auth', authRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/dentists', dentistRoutes)
app.use('/api/services', serviceRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Dental Appointment System API',
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {},
  })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(
    `📝 API Documentation available at http://localhost:${PORT}/api/health`
  )
})

module.exports = app
