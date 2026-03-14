'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Mic, Save, FileText, User, Calendar } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  idCard?: string
  phone: string
  admissionDate: string
  createdAt: string
  updatedAt: string
}

interface MedicalRecord {
  patientId: string
  chiefComplaint: string
  presentIllness: string
  pastHistory?: string
  familyHistory?: string
  physicalExam: string
  diagnosis: string
  treatment: string
}

export default function NewRecordPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [record, setRecord] = useState<MedicalRecord>({
    patientId: '',
    chiefComplaint: '',
    presentIllness: '',
    pastHistory: '',
    familyHistory: '',
    physicalExam: '',
    diagnosis: '',
    treatment: '',
  })

  useEffect(() => {
    if (params.id) {
      fetchPatientDetails()
    }
  }, [params.id])

  const fetchPatientDetails = async () => {
    try {
      const response = await fetch(`/api/patients/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPatient(data)
        setRecord(prev => ({ ...prev, patientId: data.id }))
      } else {
        console.error('Failed to fetch patient details')
      }
    } catch (error) {
      console.error('Error fetching patient details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceInput = async (field: keyof MedicalRecord) => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.lang = 'zh-CN'
      recognition.continuous = false
      recognition.interimResults = false

      setIsRecording(true)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setRecord(prev => ({
          ...prev,
          [field]: (prev[field] as string || '') + ' ' + transcript
        }))
        setIsRecording(false)
      }

      recognition.onerror = () => {
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognition.start()
    } else {
      toast({
        variant: 'destructive',
        title: '不支持语音输入',
        description: '您的浏览器不支持语音识别功能',
      })
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: '创建成功',
          description: '病历已成功创建',
        })
        router.push(`/records/${data.id}`)
      } else {
        throw new Error('创建失败')
      }
    } catch (error) {
      console.error('Error creating record:', error)
      toast({
        variant: 'destructive',
        title: '创建失败',
        description: '请稍后重试',
      })
    }
  }

  const getGenderText = (gender: string) => {
    return gender === 'male' ? '男' : gender === 'female' ? '女' : gender
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100 flex items-center justify-center">
        <div className="text-center text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 mb-4">未找到患者信息</p>
            <Link href="/patients">
              <Button>返回患者列表</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <header className="mb-6">
          <Link href={`/patients/${patient.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回患者详情
            </Button>
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">新建病历</h1>
              <p className="text-sm text-gray-600">
                患者：{patient.name} · {getGenderText(patient.gender)} · {patient.age}岁
              </p>
            </div>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              保存病历
            </Button>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              临床信息
            </CardTitle>
            <CardDescription>
              请填写患者的临床信息，可以使用语音输入
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">主诉 <span className="text-red-500">*</span></label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoiceInput('chiefComplaint')}
                  disabled={isRecording}
                >
                  <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
                  {isRecording ? '录音中...' : '语音输入'}
                </Button>
              </div>
              <Textarea
                value={record.chiefComplaint}
                onChange={(e) => setRecord({ ...record, chiefComplaint: e.target.value })}
                className="min-h-[80px]"
                placeholder="请输入患者主诉..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">现病史 <span className="text-red-500">*</span></label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoiceInput('presentIllness')}
                  disabled={isRecording}
                >
                  <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
                  {isRecording ? '录音中...' : '语音输入'}
                </Button>
              </div>
              <Textarea
                value={record.presentIllness}
                onChange={(e) => setRecord({ ...record, presentIllness: e.target.value })}
                className="min-h-[120px]"
                placeholder="请输入现病史..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">既往史</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoiceInput('pastHistory')}
                  disabled={isRecording}
                >
                  <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
                  {isRecording ? '录音中...' : '语音输入'}
                </Button>
              </div>
              <Textarea
                value={record.pastHistory}
                onChange={(e) => setRecord({ ...record, pastHistory: e.target.value })}
                className="min-h-[80px]"
                placeholder="请输入既往史（可选）..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">家族史</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoiceInput('familyHistory')}
                  disabled={isRecording}
                >
                  <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
                  {isRecording ? '录音中...' : '语音输入'}
                </Button>
              </div>
              <Textarea
                value={record.familyHistory}
                onChange={(e) => setRecord({ ...record, familyHistory: e.target.value })}
                className="min-h-[80px]"
                placeholder="请输入家族史（可选）..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">体格检查 <span className="text-red-500">*</span></label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoiceInput('physicalExam')}
                  disabled={isRecording}
                >
                  <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
                  {isRecording ? '录音中...' : '语音输入'}
                </Button>
              </div>
              <Textarea
                value={record.physicalExam}
                onChange={(e) => setRecord({ ...record, physicalExam: e.target.value })}
                className="min-h-[120px]"
                placeholder="请输入体格检查..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">初步诊断 <span className="text-red-500">*</span></label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoiceInput('diagnosis')}
                  disabled={isRecording}
                >
                  <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
                  {isRecording ? '录音中...' : '语音输入'}
                </Button>
              </div>
              <Textarea
                value={record.diagnosis}
                onChange={(e) => setRecord({ ...record, diagnosis: e.target.value })}
                className="min-h-[80px]"
                placeholder="请输入初步诊断..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">诊疗计划 <span className="text-red-500">*</span></label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoiceInput('treatment')}
                  disabled={isRecording}
                >
                  <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
                  {isRecording ? '录音中...' : '语音输入'}
                </Button>
              </div>
              <Textarea
                value={record.treatment}
                onChange={(e) => setRecord({ ...record, treatment: e.target.value })}
                className="min-h-[120px]"
                placeholder="请输入诊疗计划..."
              />
            </div>

            <div className="pt-4 border-t text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>入院日期：{format(new Date(patient.admissionDate), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}