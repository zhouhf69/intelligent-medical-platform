'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Mic, Save, Edit, FileText, User, Calendar, Send, Check, X, Printer } from 'lucide-react'
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

export default function RecordDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [record, setRecord] = useState<MedicalRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
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

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedRecord(record || {})
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
        setIsEditing(false)
        toast({
          title: '保存成功',
          description: '病历已成功更新',
        })
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

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/records/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'submitted' }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecord(data)
        toast({
          title: '提交成功',
          description: '病历已提交审核',
        })
      } else {
        throw new Error('提交失败')
      }
    } catch (error) {
      console.error('Error submitting record:', error)
      toast({
        variant: 'destructive',
        title: '提交失败',
        description: '请稍后重试',
      })
    }
  }

  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/records/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecord(data)
        toast({
          title: '审核通过',
          description: '病历已审核通过',
        })
      } else {
        throw new Error('审核失败')
      }
    } catch (error) {
      console.error('Error approving record:', error)
      toast({
        variant: 'destructive',
        title: '审核失败',
        description: '请稍后重试',
      })
    }
  }

  const handleReject = async () => {
    try {
      const response = await fetch(`/api/records/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecord(data)
        toast({
          title: '已驳回',
          description: '病历已驳回',
        })
      } else {
        throw new Error('驳回失败')
      }
    } catch (error) {
      console.error('Error rejecting record:', error)
      toast({
        variant: 'destructive',
        title: '驳回失败',
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
        return <Badge variant="secondary">草稿</Badge>
      case 'submitted':
        return <Badge variant="default">已提交</Badge>
      case 'approved':
        return <Badge variant="success">已审核</Badge>
      case 'rejected':
        return <Badge variant="destructive">已驳回</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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
          <Link href={`/patients/${record.patientId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回患者详情
            </Button>
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">病历详情</h1>
              <p className="text-sm text-gray-600">
                患者：{record.patient.name} · {format(new Date(record.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
              </p>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(record.status)}
              {!isEditing ? (
                <div className="flex gap-2">
                  <Button onClick={() => window.print()}>
                    <Printer className="w-4 h-4 mr-2" />
                    打印
                  </Button>
                  {record.status === 'draft' && (
                    <Button onClick={handleSubmit}>
                      <Send className="w-4 h-4 mr-2" />
                      提交审核
                    </Button>
                  )}
                  {record.status === 'submitted' && (
                    <>
                      <Button onClick={handleApprove}>
                        <Check className="w-4 h-4 mr-2" />
                        审核通过
                      </Button>
                      <Button variant="destructive" onClick={handleReject}>
                        <X className="w-4 h-4 mr-2" />
                        驳回
                      </Button>
                    </>
                  )}
                  {record.status !== 'approved' && (
                    <Button onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      编辑病历
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    保存
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    取消
                  </Button>
                </div>
              )}
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
              {isEditing ? '编辑病历信息' : '查看病历详情'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">主诉</label>
                {isEditing && (
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
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editedRecord.chiefComplaint || ''}
                  onChange={(e) => setEditedRecord({ ...editedRecord, chiefComplaint: e.target.value })}
                  className="min-h-[80px]"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">{record.chiefComplaint}</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">现病史</label>
                {isEditing && (
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
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editedRecord.presentIllness || ''}
                  onChange={(e) => setEditedRecord({ ...editedRecord, presentIllness: e.target.value })}
                  className="min-h-[120px]"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">{record.presentIllness}</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">既往史</label>
                {isEditing && (
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
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editedRecord.pastHistory || ''}
                  onChange={(e) => setEditedRecord({ ...editedRecord, pastHistory: e.target.value })}
                  className="min-h-[80px]"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">{record.pastHistory || '无'}</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">家族史</label>
                {isEditing && (
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
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editedRecord.familyHistory || ''}
                  onChange={(e) => setEditedRecord({ ...editedRecord, familyHistory: e.target.value })}
                  className="min-h-[80px]"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">{record.familyHistory || '无'}</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">体格检查</label>
                {isEditing && (
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
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editedRecord.physicalExam || ''}
                  onChange={(e) => setEditedRecord({ ...editedRecord, physicalExam: e.target.value })}
                  className="min-h-[120px]"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">{record.physicalExam}</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">初步诊断</label>
                {isEditing && (
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
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editedRecord.diagnosis || ''}
                  onChange={(e) => setEditedRecord({ ...editedRecord, diagnosis: e.target.value })}
                  className="min-h-[80px]"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">{record.diagnosis}</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">诊疗计划</label>
                {isEditing && (
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
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editedRecord.treatment || ''}
                  onChange={(e) => setEditedRecord({ ...editedRecord, treatment: e.target.value })}
                  className="min-h-[120px]"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">{record.treatment}</div>
              )}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}