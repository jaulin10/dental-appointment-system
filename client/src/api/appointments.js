import api from './axios'

export const getPatients = () => api.get('/api/patients')
export const getDentists = () => api.get('/api/dentists')
export const getServices = () => api.get('/api/services')
export const createAppointment = (data) => api.post('/api/appointments', data)
