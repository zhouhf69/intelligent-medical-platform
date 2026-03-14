import { create } from 'zustand'
import { MedicalRecord } from '@/types'

interface RecordState {
  records: MedicalRecord[]
  currentRecord: MedicalRecord | null
  loading: boolean
  error: string | null
  
  setRecords: (records: MedicalRecord[]) => void
  setCurrentRecord: (record: MedicalRecord | null) => void
  addRecord: (record: MedicalRecord) => void
  updateRecord: (id: string, record: Partial<MedicalRecord>) => void
  deleteRecord: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useRecordStore = create<RecordState>((set) => ({
  records: [],
  currentRecord: null,
  loading: false,
  error: null,
  
  setRecords: (records) => set({ records }),
  setCurrentRecord: (record) => set({ currentRecord: record }),
  addRecord: (record) => set((state) => ({ records: [record, ...state.records] })),
  updateRecord: (id, updatedRecord) => set((state) => ({
    records: state.records.map(r => r.id === id ? { ...r, ...updatedRecord } : r),
    currentRecord: state.currentRecord?.id === id ? { ...state.currentRecord, ...updatedRecord } : state.currentRecord,
  })),
  deleteRecord: (id) => set((state) => ({
    records: state.records.filter(r => r.id !== id),
    currentRecord: state.currentRecord?.id === id ? null : state.currentRecord,
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))