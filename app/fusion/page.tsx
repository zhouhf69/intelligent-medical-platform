'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Mic, Camera, FileText, Sparkles, Save, CheckCircle2, AlertCircle, Download, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface TranscriptionData {
  id: string
  speakerLabel: string
  text: string
  timestamp: string
}

interface ExtractedData {
  name?: string
  idCard?: string
  age?: number
  gender?: 'male' | 'female'
  phone?: string
  address?: string
  diagnosis?: string
  treatment?: string
  rawText?: string
}

interface FusionInput {
  transcriptions: TranscriptionData[]
  extractedData: ExtractedData
  manualInputs: {
    chiefComplaint: string
    presentIllness: string
    pastHistory: string
    familyHistory: string
    physicalExam: string
    diagnosis: string
    treatment: string
  }
  templateId: string
}

interface FusionOutput {
  medicalRecord: {
    chiefComplaint: string
    presentIllness: string
    pastHistory: string
    familyHistory: string
    physicalExam: string
    diagnosis: string
    treatment: string
  }
  confidence: number
  sources: Array<{
    type: string
    content: string
    confidence: number
  }>
  suggestions: string[]
}

export default function FusionPage() {
  const [selectedPatient, setSelectedPatient] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('outpatient')
  const [transcriptions, setTranscriptions] = useState<TranscriptionData[]>([])
  const [extractedData, setExtractedData] = useState<ExtractedData>({})
  const [manualInputs, setManualInputs] = useState({
    chiefComplaint: '',
    presentIllness: '',
    pastHistory: '',
    familyHistory: '',
    physicalExam: '',
    diagnosis: '',
    treatment: ''
  })
  const [fusionOutput, setFusionOutput] = useState<FusionOutput | null>(null)
  const [isFusing, setIsFusing] = useState(false)
  const [savedTranscription, setSavedTranscription] = useState('')
  const [savedExtractedData, setSavedExtractedData] = useState<ExtractedData>({})

  useEffect(() => {
    const transcription = localStorage.getItem('transcription')
    const extractedDataStr = localStorage.getItem('extractedData')
    
    if (transcription) {
      setSavedTranscription(transcription)
      setTranscriptions([
        {
          id: '1',
          speakerLabel: '医生',
          text: transcription,
          timestamp: new Date().toISOString()
        }
      ])
    }
    
    if (extractedDataStr) {
      const data = JSON.parse(extractedDataStr)
      setSavedExtractedData(data)
      setExtractedData(data)
    }
  }, [])

  const handleFuse = async () => {
    setIsFusing(true)
    try {
      const fusionInput: FusionInput = {
        transcriptions,
        extractedData,
        manualInputs,
        templateId: selectedTemplate
      }

      const response = await fetch('/api/fusion/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fusionInput)
      })

      if (response.ok) {
        const data = await response.json()
        setFusionOutput(data)
      } else {
        throw new Error('Fusion failed')
      }
    } catch (error) {
      console.error('Error fusing data:', error)
      alert('数据融合失败，请重试')
    } finally {
      setIsFusing(false)
    }
  }

  const handleSaveRecord = async () => {
    if (!fusionOutput) return

    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: selectedPatient,
          ...fusionOutput.medicalRecord,
          fusionData: fusionOutput
        })
      })

      if (response.ok) {
        alert('病历保存成功！')
      } else {
        throw new Error('Save failed')
      }
    } catch (error) {
      console.error('Error saving record:', error)
      alert('病历保存失败，请重试')
    }
  }

  const handleDownload = () => {
    if (!fusionOutput) return

    const content = `
病历记录
========

患者ID: ${selectedPatient}
模版: ${selectedTemplate}
生成时间: ${new Date().toLocaleString('zh-CN')}
置信度: ${(fusionOutput.confidence * 100).toFixed(2)}%

主诉
----
${fusionOutput.medicalRecord.chiefComplaint}

现病史
------
${fusionOutput.medicalRecord.presentIllness}

既往史
------
${fusionOutput.medicalRecord.pastHistory}

家族史
------
${fusionOutput.medicalRecord.familyHistory}

体格检查
--------
${fusionOutput.medicalRecord.physicalExam}

诊断
----
${fusionOutput.medicalRecord.diagnosis}

治疗方案
--------
${fusionOutput.medicalRecord.treatment}

建议
----
${fusionOutput.suggestions.join('\n')}

数据来源
--------
${fusionOutput.sources.map(s => `- ${s.type}: ${s.content} (置信度: ${(s.confidence * 100).toFixed(2)}%)`).join('\n')}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `medical-record-${Date.now()}.txt`
    link.click()
  }

  const templates = [
    { id: 'outpatient', name: '门诊病历' },
    { id: 'inpatient', name: '住院病历' },
    { id: 'emergency', name: '急诊病历' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">多模态融合</h1>
            <p className="text-sm text-gray-600">智能融合语音、图像、文本生成病历</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>输入数据</CardTitle>
                <CardDescription>选择或输入要融合的数据</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">患者</Label>
                    <Input
                      id="patient"
                      placeholder="选择患者"
                      value={selectedPatient}
                      onChange={(e) => setSelectedPatient(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template">病历模版</Label>
                    <select
                      id="template"
                      className="w-full px-3 py-2 border rounded-md"
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>语音转录</Label>
                    <Link href="/recording">
                      <Button variant="ghost" size="sm">
                        <Mic className="w-4 h-4 mr-1" />
                        录音
                      </Button>
                    </Link>
                  </div>
                  {transcriptions.length > 0 ? (
                    <div className="space-y-2">
                      {transcriptions.map(t => (
                        <div key={t.id} className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs text-blue-600 mb-1">
                            {t.speakerLabel} - {new Date(t.timestamp).toLocaleTimeString('zh-CN')}
                          </div>
                          <div className="text-sm text-gray-900">{t.text}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                      暂无语音转录数据
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>图像识别数据</Label>
                    <Link href="/ocr">
                      <Button variant="ghost" size="sm">
                        <Camera className="w-4 h-4 mr-1" />
                        识别
                      </Button>
                    </Link>
                  </div>
                  {Object.keys(extractedData).length > 0 ? (
                    <div className="p-4 bg-green-50 rounded-lg space-y-2">
                      {extractedData.name && (
                        <div className="text-sm">
                          <span className="text-gray-600">姓名：</span>
                          <span className="font-medium">{extractedData.name}</span>
                        </div>
                      )}
                      {extractedData.idCard && (
                        <div className="text-sm">
                          <span className="text-gray-600">身份证：</span>
                          <span className="font-medium">{extractedData.idCard}</span>
                        </div>
                      )}
                      {extractedData.diagnosis && (
                        <div className="text-sm">
                          <span className="text-gray-600">诊断：</span>
                          <span className="font-medium">{extractedData.diagnosis}</span>
                        </div>
                      )}
                      {extractedData.treatment && (
                        <div className="text-sm">
                          <span className="text-gray-600">治疗：</span>
                          <span className="font-medium">{extractedData.treatment}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                      暂无图像识别数据
                    </div>
                  )}
                </div>

                <div>
                  <Label>手动输入</Label>
                  <div className="space-y-4 mt-2">
                    <div>
                      <Label htmlFor="chiefComplaint">主诉</Label>
                      <Textarea
                        id="chiefComplaint"
                        value={manualInputs.chiefComplaint}
                        onChange={(e) => setManualInputs({ ...manualInputs, chiefComplaint: e.target.value })}
                        placeholder="患者的主要症状和持续时间"
                      />
                    </div>
                    <div>
                      <Label htmlFor="presentIllness">现病史</Label>
                      <Textarea
                        id="presentIllness"
                        value={manualInputs.presentIllness}
                        onChange={(e) => setManualInputs({ ...manualInputs, presentIllness: e.target.value })}
                        placeholder="疾病的起因、发展过程、诊疗经过"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pastHistory">既往史</Label>
                      <Textarea
                        id="pastHistory"
                        value={manualInputs.pastHistory}
                        onChange={(e) => setManualInputs({ ...manualInputs, pastHistory: e.target.value })}
                        placeholder="过去的疾病史、手术史、过敏史"
                      />
                    </div>
                    <div>
                      <Label htmlFor="familyHistory">家族史</Label>
                      <Textarea
                        id="familyHistory"
                        value={manualInputs.familyHistory}
                        onChange={(e) => setManualInputs({ ...manualInputs, familyHistory: e.target.value })}
                        placeholder="家族遗传病史"
                      />
                    </div>
                    <div>
                      <Label htmlFor="physicalExam">体格检查</Label>
                      <Textarea
                        id="physicalExam"
                        value={manualInputs.physicalExam}
                        onChange={(e) => setManualInputs({ ...manualInputs, physicalExam: e.target.value })}
                        placeholder="体格检查结果"
                      />
                    </div>
                    <div>
                      <Label htmlFor="diagnosis">诊断</Label>
                      <Textarea
                        id="diagnosis"
                        value={manualInputs.diagnosis}
                        onChange={(e) => setManualInputs({ ...manualInputs, diagnosis: e.target.value })}
                        placeholder="诊断结果"
                      />
                    </div>
                    <div>
                      <Label htmlFor="treatment">治疗方案</Label>
                      <Textarea
                        id="treatment"
                        value={manualInputs.treatment}
                        onChange={(e) => setManualInputs({ ...manualInputs, treatment: e.target.value })}
                        placeholder="治疗计划和用药建议"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleFuse} 
                    disabled={isFusing}
                    className="flex-1"
                  >
                    {isFusing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        融合中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        开始融合
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {fusionOutput && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    融合结果
                  </CardTitle>
                  <CardDescription>
                    置信度: {(fusionOutput.confidence * 100).toFixed(2)}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>主诉</Label>
                      <div className="p-3 bg-gray-50 rounded-lg mt-1">
                        {fusionOutput.medicalRecord.chiefComplaint}
                      </div>
                    </div>
                    <div>
                      <Label>现病史</Label>
                      <div className="p-3 bg-gray-50 rounded-lg mt-1">
                        {fusionOutput.medicalRecord.presentIllness}
                      </div>
                    </div>
                    <div>
                      <Label>既往史</Label>
                      <div className="p-3 bg-gray-50 rounded-lg mt-1">
                        {fusionOutput.medicalRecord.pastHistory}
                      </div>
                    </div>
                    <div>
                      <Label>家族史</Label>
                      <div className="p-3 bg-gray-50 rounded-lg mt-1">
                        {fusionOutput.medicalRecord.familyHistory}
                      </div>
                    </div>
                    <div>
                      <Label>体格检查</Label>
                      <div className="p-3 bg-gray-50 rounded-lg mt-1">
                        {fusionOutput.medicalRecord.physicalExam}
                      </div>
                    </div>
                    <div>
                      <Label>诊断</Label>
                      <div className="p-3 bg-gray-50 rounded-lg mt-1">
                        {fusionOutput.medicalRecord.diagnosis}
                      </div>
                    </div>
                    <div>
                      <Label>治疗方案</Label>
                      <div className="p-3 bg-gray-50 rounded-lg mt-1">
                        {fusionOutput.medicalRecord.treatment}
                      </div>
                    </div>
                  </div>

                  {fusionOutput.suggestions.length > 0 && (
                    <div>
                      <Label>建议</Label>
                      <div className="p-3 bg-yellow-50 rounded-lg mt-1 space-y-1">
                        {fusionOutput.suggestions.map((s, i) => (
                          <div key={i} className="text-sm text-yellow-800">
                            • {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={handleSaveRecord} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      保存病历
                    </Button>
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>数据来源</CardTitle>
                <CardDescription>查看融合使用的数据源</CardDescription>
              </CardHeader>
              <CardContent>
                {fusionOutput ? (
                  <div className="space-y-3">
                    {fusionOutput.sources.map((source, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">
                            {source.type === 'audio' && <Mic className="w-4 h-4 inline mr-1" />}
                            {source.type === 'image' && <Camera className="w-4 h-4 inline mr-1" />}
                            {source.type === 'manual' && <FileText className="w-4 h-4 inline mr-1" />}
                            {source.type === 'ai' && <Sparkles className="w-4 h-4 inline mr-1" />}
                            {source.type === 'audio' && '语音'}
                            {source.type === 'image' && '图像'}
                            {source.type === 'manual' && '手动'}
                            {source.type === 'ai' && 'AI生成'}
                          </div>
                          <div className="text-xs text-gray-600">
                            {(source.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 truncate">
                          {source.content}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    暂无数据源信息
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>使用说明</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>1. 选择患者和病历模版</p>
                <p>2. 录音或上传语音转录</p>
                <p>3. 识别或上传图像数据</p>
                <p>4. 填写必要的手动输入</p>
                <p>5. 点击"开始融合"生成病历</p>
                <p>6. 审核并保存病历</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}