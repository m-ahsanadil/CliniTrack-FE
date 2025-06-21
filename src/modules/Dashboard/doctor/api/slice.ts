import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProviderAdminProfileRequest } from './types'

interface DoctorState {
  list: ProviderAdminProfileRequest[]
  loading: boolean
  error: string | null
  lastFetched: number | null
  currentDoctor: ProviderAdminProfileRequest | null
}

const initialState: DoctorState = {
  list: [],
  loading: false,
  error: null,
  lastFetched: null,
  currentDoctor: null
}

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    // Fetch actions
    fetchDoctorsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    fetchDoctorsSuccess: (state, action: PayloadAction<ProviderAdminProfileRequest[]>) => {
      state.loading = false
      state.list = action.payload
      state.lastFetched = Date.now()
      state.error = null
    },
    fetchDoctorsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Set current doctor
    setCurrentDoctor: (state, action: PayloadAction<string>) => {
      const doctorId = action.payload
      state.currentDoctor = state.list.find(doc => doc.providerId === doctorId) || null
    },

    // Clear current doctor
    clearCurrentDoctor: (state) => {
      state.currentDoctor = null
    },

    // Update doctor in list
    updateDoctorInList: (state, action: PayloadAction<ProviderAdminProfileRequest>) => {
      const updatedDoctor = action.payload
      const index = state.list.findIndex(doc => doc._id === updatedDoctor._id)
      
      if (index !== -1) {
        state.list[index] = updatedDoctor
        
        // Update current doctor if it's the same one
        if (state.currentDoctor?._id === updatedDoctor._id) {
          state.currentDoctor = updatedDoctor
        }
      }
    },

    // Add new doctor to list
    addDoctorToList: (state, action: PayloadAction<ProviderAdminProfileRequest>) => {
      const newDoctor = action.payload
      const exists = state.list.some(doc => doc._id === newDoctor._id)
      
      if (!exists) {
        state.list.push(newDoctor)
      }
    },

    // Remove doctor from list
    removeDoctorFromList: (state, action: PayloadAction<string>) => {
      const doctorId = action.payload
      state.list = state.list.filter(doc => doc._id !== doctorId)
      
      // Clear current doctor if it's the one being removed
      if (state.currentDoctor?._id === doctorId) {
        state.currentDoctor = null
      }
    },

    // Clear all doctors
    clearDoctors: (state) => {
      state.list = []
      state.currentDoctor = null
      state.lastFetched = null
      state.error = null
    },

    // Clear only error
    clearError: (state) => {
      state.error = null
    },

    // Set loading state manually (useful for individual operations)
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    }
  }
})

export const {
  fetchDoctorsRequest,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
  setCurrentDoctor,
  clearCurrentDoctor,
  updateDoctorInList,
  addDoctorToList,
  removeDoctorFromList,
  clearDoctors,
  clearError,
  setLoading
} = doctorSlice.actions

export default doctorSlice.reducer

// Selectors (optional - you can also create these in a separate selectors file)
export const selectDoctorsList = (state: { doctor: DoctorState }) => state.doctor.list
export const selectCurrentDoctor = (state: { doctor: DoctorState }) => state.doctor.currentDoctor
export const selectDoctorsLoading = (state: { doctor: DoctorState }) => state.doctor.loading
export const selectDoctorsError = (state: { doctor: DoctorState }) => state.doctor.error
export const selectLastFetched = (state: { doctor: DoctorState }) => state.doctor.lastFetched

// Complex selectors
export const selectDoctorById = (state: { doctor: DoctorState }, doctorId: string) => 
  state.doctor.list.find(doc => doc._id === doctorId)

export const selectDoctorByProviderId = (state: { doctor: DoctorState }, providerId: string) => 
  state.doctor.list.find(doc => doc.providerId === providerId)

export const selectActiveDoctors = (state: { doctor: DoctorState }) => 
  state.doctor.list.filter(doc => doc.status.toLowerCase() === 'active')

export const selectDoctorsBySpecialty = (state: { doctor: DoctorState }, specialty: string) => 
  state.doctor.list.filter(doc => doc.specialty === specialty)