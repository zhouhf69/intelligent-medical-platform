'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Users, Calendar, Activity, Mic, Camera, Save, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    idCard: '',
    phone: '',
    admissionDate: '',
  })

  const [clinicalFacts, setClinicalFacts] = useState({
    chiefComplaint: '',
    presentIllness: '',
    pastHistory: '',
    familyHistory: '',
    physicalExam: '',
    diagnosis: '',
    treatment: '',
  })

  const [isRecording, setIsRecording] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleVoiceInput = async (field: string) => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.lang = 'zh-CN'
      recognition.continuous = false
      recognition.interimResults = false

      setIsRecording(true)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setClinicalFacts(prev => ({
          ...prev,
          [field]: prev[field] + (prev[field] ? ' ' : '') + transcript
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
    if (!patientInfo.name || !patientInfo.age || !patientInfo.gender || !patientInfo.phone || !patientInfo.admissionDate) {
      toast({
        variant: 'destructive',
        title: '验证失败',
        description: '请填写所有必填字段',
      })
      return
    }

    if (!clinicalFacts.chiefComplaint || !clinicalFacts.presentIllness || !clinicalFacts.physicalExam || !clinicalFacts.diagnosis || !clinicalFacts.treatment) {
      toast({
        variant: 'destructive',
        title: '验证失败',
        description: '请填写所有必填的临床信息',
      })
      return
    }

    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const patientResponse = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: patientInfo.name,
          age: parseInt(patientInfo.age),
          gender: patientInfo.gender,
          idCard: patientInfo.idCard,
          phone: patientInfo.phone,
          admissionDate: patientInfo.admissionDate,
        }),
      })

      if (!patientResponse.ok) {
        throw new Error('创建患者失败')
      }

      const patient = await patientResponse.json()

      const recordResponse = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patient.id,
          chiefComplaint: clinicalFacts.chiefComplaint,
          presentIllness: clinicalFacts.presentIllness,
          pastHistory: clinicalFacts.pastHistory,
          familyHistory: clinicalFacts.familyHistory,
          physicalExam: clinicalFacts.physicalExam,
          diagnosis: clinicalFacts.diagnosis,
          treatment: clinicalFacts.treatment,
          status: 'draft',
        }),
      })

      if (!recordResponse.ok) {
        throw new Error('创建病历失败')
      }

      setSaveStatus('success')
      toast({
        title: '保存成功',
        description: '患者信息和病历已成功创建',
      })

      setTimeout(() => {
        setSaveStatus('idle')
        setPatientInfo({
          name: '',
          age: '',
          gender: '',
          idCard: '',
          phone: '',
          admissionDate: '',
        })
        setClinicalFacts({
          chiefComplaint: '',
          presentIllness: '',
          pastHistory: '',
          familyHistory: '',
          physicalExam: '',
          diagnosis: '',
          treatment: '',
        })
      }, 2000)
    } catch (error) {
      console.error('Error saving:', error)
      setSaveStatus('error')
      toast({
        variant: 'destructive',
        title: '保存失败',
        description: error instanceof Error ? error.message : '请稍后重试',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-medical-500 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">智能病历平台</h1>
                <p className="text-sm text-gray-600">智能病历源头生成与全流程质控平台</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/about">
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  关于平台
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  数据统计
                </Button>
              </Link>
              <Link href="/patients">
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  患者列表
                </Button>
              </Link>
              <Link href="/todos">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  今日待办
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  患者基本信息
                </CardTitle>
                <CardDescription>录入患者的基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名 *</Label>
                  <Input
                    id="name"
                    placeholder="请输入患者姓名"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">年龄 *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="年龄"
                      value={patientInfo.age}
                      onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                      min="0"
                      max="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">性别 *</Label>
                    <select
                      id="gender"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={patientInfo.gender}
                      onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                    >
                      <option value="">请选择</option>
                      <option value="male">男</option>
                      <option value="female">女</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idCard">身份证号</Label>
                  <Input
                    id="idCard"
                    placeholder="请输入身份证号"
                    value={patientInfo.idCard}
                    onChange={(e) => setPatientInfo({ ...patientInfo, idCard: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">联系电话 *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入联系电话"
                    value={patientInfo.phone}
                    onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                    pattern="[0-9]*"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admissionDate">入院日期 *</Label>
                  <Input
                    id="admissionDate"
                    type="date"
                    value={patientInfo.admissionDate}
                    onChange={(e) => setPatientInfo({ ...patientInfo, admissionDate: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  临床事实录入
                </CardTitle>
                <CardDescription>录入患者的临床信息，支持语音输入</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chiefComplaint">主诉 *</Label>
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
                    id="chiefComplaint"
                    placeholder="请输入患者主诉，如：发热3天，伴咳嗽、咽痛"
                    className="min-h-[100px]"
                    value={clinicalFacts.chiefComplaint}
                    onChange={(e) => setClinicalFacts({ ...clinicalFacts, chiefComplaint: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="presentIllness">现病史 *</Label>
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
                    id="presentIllness"
                    placeholder="请详细描述现病史"
                    className="min-h-[150px]"
                    value={clinicalFacts.presentIllness}
                    onChange={(e) => setClinicalFacts({ ...clinicalFacts, presentIllness: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pastHistory">既往史</Label>
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
                    id="pastHistory"
                    placeholder="请输入既往病史"
                    className="min-h-[100px]"
                    value={clinicalFacts.pastHistory}
                    onChange={(e) => setClinicalFacts({ ...clinicalFacts, pastHistory: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="familyHistory">家族史</Label>
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
                    id="familyHistory"
                    placeholder="请输入家族病史"
                    className="min-h-[100px]"
                    value={clinicalFacts.familyHistory}
                    onChange={(e) => setClinicalFacts({ ...clinicalFacts, familyHistory: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="physicalExam">体格检查 *</Label>
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
                    id="physicalExam"
                    placeholder="请输入体格检查结果"
                    className="min-h-[150px]"
                    value={clinicalFacts.physicalExam}
                    onChange={(e) => setClinicalFacts({ ...clinicalFacts, physicalExam: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="diagnosis">初步诊断 *</Label>
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
                    id="diagnosis"
                    placeholder="请输入初步诊断"
                    className="min-h-[100px]"
                    value={clinicalFacts.diagnosis}
                    onChange={(e) => setClinicalFacts({ ...clinicalFacts, diagnosis: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="treatment">诊疗计划 *</Label>
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
                    id="treatment"
                    placeholder="请输入诊疗计划"
                    className="min-h-[150px]"
                    value={clinicalFacts.treatment}
                    onChange={(e) => setClinicalFacts({ ...clinicalFacts, treatment: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? '保存中...' : '保存病历'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    拍照上传
                  </Button>
                </div>

                {saveStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>病历保存成功！</span>
                  </div>
                )}

                {saveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span>保存失败，请重试</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}