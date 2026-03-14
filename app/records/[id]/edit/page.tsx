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

interface MedicalRecord {
  id: string
  patientId: string
  patient: {
    id: string
    name: string
  }
  chiefComplaint: string
  presentIllness: string
  pastHistory?: string
  familyHistory?: string
  physicalExam: string
  diagnosis: string
  treatment: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function EditRecordPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [record, setRecord] = useState<MedicalRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [editedRecord, setEditedRecord] = useState<Partial<MedicalRecord>>({})

  useEffect(() => {
    if (params.id) {
      fetchRecordDetails()
    }
  }, [params.id])

  const fetchRecordDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/records/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setRecord(data)
        setEditedRecord(data)
      } else {
        console.error('Failed to fetch record details')
      }
    } catch (error) {
      console.error('Error fetching record details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/records/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRecord),
      })

      if (response.ok) {
        const data = await response.json()
        setRecord(data)
        toast({
          title: '保存成功',
          description: '病历已成功更新',
        })
        router.push(`/records/${params.id}`)
      } else {
        throw new Error('保存失败')
      }
    } catch (error) {
      console.error('Error saving record:', error)
      toast({
        variant: 'destructive',
        title: '保存失败',
        description: '请稍后重试',
      })
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
        setEditedRecord(prev => ({
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">草稿</span>
      case 'submitted':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">已提交</span>
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm">已审核</span>
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm">已驳回</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100 flex items-center justify-center">
        <div className="text-center text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 mb-4">未找到病历记录</p>
            <Link href="/">
              <Button>返回首页</Button>
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
          <Link href={`/records/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回病历详情
            </Button>
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">编辑病历</h1>
              <p className="text-sm text-gray-600">
                患者：{record.patient.name} · {format(new Date(record.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
              </p>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(record.status)}
            </div>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              临床信息
            </CardTitle>
            <CardDescription>
              编辑病历信息，可以使用语音输入
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
                value={editedRecord.chiefComplaint || ''}
                onChange={(e) => setEditedRecord({ ...editedRecord, chiefComplaint: e.target.value })}
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
                value={editedRecord.presentIllness || ''}
                onChange={(e) => setEditedRecord({ ...editedRecord, presentIllness: e.target.value })}
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
                value={editedRecord.pastHistory || ''}
                onChange={(e) => setEditedRecord({ ...editedRecord, pastHistory: e.target.value })}
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
                value={editedRecord.familyHistory || ''}
                onChange={(e) => setEditedRecord({ ...editedRecord, familyHistory: e.target.value })}
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
                value={editedRecord.physicalExam || ''}
                onChange={(e) => setEditedRecord({ ...editedRecord, physicalExam: e.target.value })}
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
                value={editedRecord.diagnosis || ''}
                onChange={(e) => setEditedRecord({ ...editedRecord, diagnosis: e.target.value })}
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
                value={editedRecord.treatment || ''}
                onChange={(e) => setEditedRecord({ ...editedRecord, treatment: e.target.value })}
                className="min-h-[120px]"
                placeholder="请输入诊疗计划..."
              />
            </div>

            <div className="pt-4 border-t text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>创建时间：{format(new Date(record.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>更新时间：{format(new Date(record.updatedAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                保存修改
              </Button>
              <Link href={`/records/${params.id}`} className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  取消
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}