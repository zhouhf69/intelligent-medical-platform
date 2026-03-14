import { create } from 'zustand'
import { Patient, MedicalRecord } from '@/types'

interface PatientState {
  patients: Patient[]
  currentPatient: Patient | null
  loading: boolean
  error: string | null
  
  setPatients: (patients: Patient[]) => void
  setCurrentPatient: (patient: Patient | null) => void
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void
  deletePatient: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const usePatientStore = create<PatientState>((set) => ({
  patients: [],
  currentPatient: null,
  loading: false,
  error: null,
  
  setPatients: (patients) => set({ patients }),
  setCurrentPatient: (patient) => set({ currentPatient: patient }),
  addPatient: (patient) => set((state) => ({ patients: [patient, ...state.patients] })),
  updatePatient: (id, updatedPatient) => set((state) => ({
    patients: state.patients.map(p => p.id === id ? { ...p, ...updatedPatient } : p),
    currentPatient: state.currentPatient?.id === id ? { ...state.currentPatient, ...updatedPatient } : state.currentPatient,
  })),
  deletePatient: (id) => set((state) => ({
    patients: state.patients.filter(p => p.id !== id),
    currentPatient: state.currentPatient?.id === id ? null : state.currentPatient,
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))