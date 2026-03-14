export interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  idCard?: string
  phone: string
  admissionDate: string
  createdAt: string
  updatedAt: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  patient?: Patient
  chiefComplaint: string
  presentIllness: string
  pastHistory?: string
  familyHistory?: string
  physicalExam: string
  diagnosis: string
  treatment: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface CreatePatientInput {
  name: string
  age: number
  gender: 'male' | 'female'
  idCard?: string
  phone: string
  admissionDate: string
}

export interface UpdatePatientInput extends Partial<CreatePatientInput> {}

export interface CreateRecordInput {
  patientId: string
  chiefComplaint: string
  presentIllness: string
  pastHistory?: string
  familyHistory?: string
  physicalExam: string
  diagnosis: string
  treatment: string
}

export interface UpdateRecordInput extends Partial<CreateRecordInput> {
  status?: 'draft' | 'submitted' | 'approved' | 'rejected'
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface TodoItem {
  id: string
  type: 'record' | 'review' | 'followup'
  title: string
  description: string
  patientName: string
  patientId: string
  recordId?: string
  priority: 'high' | 'medium' | 'low'
  createdAt: string
  dueDate?: string
}

export interface ApiResponse<T = any> {
  success?: boolean
  data?: T
  error?: string
  message?: string
}