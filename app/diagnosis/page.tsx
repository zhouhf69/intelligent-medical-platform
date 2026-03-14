'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, Lightbulb, TrendingUp } from 'lucide-react'

interface DiagnosisSuggestion {
  diagnosis: string
  confidence: number
  icd10: string
  description: string
  recommendedTests: string[]
  treatmentOptions: string[]
  riskFactors: string[]
  followUp: string
}

export default function DiagnosisPage() {
  const [medicalData, setMedicalData] = useState({
    chiefComplaint: '',
    presentIllness: '',
    physicalExam: '',
    age: 45,
    gender: 'male'
  })
  const [suggestions, setSuggestions] = useState<DiagnosisSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  const handleGetSuggestions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/diagnosis/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(medicalData)
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error('Error getting diagnosis suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800'
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">智能诊断建议</h1>
          <p className="text-muted-foreground">基于患者症状和体征的AI辅助诊断系统</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>输入患者信息</CardTitle>
              <CardDescription>填写患者症状和体征信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="chiefComplaint">主诉</Label>
                <Textarea
                  id="chiefComplaint"
                  placeholder="患者的主要症状..."
                  value={medicalData.chiefComplaint}
                  onChange={(e) => setMedicalData({ ...medicalData, chiefComplaint: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="presentIllness">现病史</Label>
                <Textarea
                  id="presentIllness"
                  placeholder="疾病的起病、发展过程..."
                  value={medicalData.presentIllness}
                  onChange={(e) => setMedicalData({ ...medicalData, presentIllness: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="physicalExam">体格检查</Label>
                <Textarea
                  id="physicalExam"
                  placeholder="生命体征和检查结果..."
                  value={medicalData.physicalExam}
                  onChange={(e) => setMedicalData({ ...medicalData, physicalExam: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">年龄</Label>
                  <Input
                    id="age"
                    type="number"
                    value={medicalData.age}
                    onChange={(e) => setMedicalData({ ...medicalData, age: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">性别</Label>
                  <select
                    id="gender"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={medicalData.gender}
                    onChange={(e) => setMedicalData({ ...medicalData, gender: e.target.value })}
                  >
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleGetSuggestions}
                disabled={loading}
                className="w-full"
              >
                {loading ? '分析中...' : '获取诊断建议'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>诊断建议</CardTitle>
              <CardDescription>AI分析结果和建议</CardDescription>
            </CardHeader>
            <CardContent>
              {suggestions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Lightbulb className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p>输入患者信息后，点击"获取诊断建议"按钮</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{suggestion.diagnosis}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                        </div>
                        <Badge className={getConfidenceColor(suggestion.confidence)}>
                          {Math.round(suggestion.confidence * 100)}%
                        </Badge>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 mb-4">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            ICD-10编码
                          </h4>
                          <p className="text-sm bg-muted p-2 rounded">{suggestion.icd10}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            建议检查
                          </h4>
                          <ul className="text-sm space-y-1">
                            {suggestion.recommendedTests.map((test, i) => (
                              <li key={i} className="flex items-start">
                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 mt-0.5" />
                                {test}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 mb-4">
                        <div>
                          <h4 className="font-medium mb-2">治疗方案</h4>
                          <ul className="text-sm space-y-1">
                            {suggestion.treatmentOptions.map((option, i) => (
                              <li key={i} className="flex items-start">
                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 mt-0.5" />
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">风险因素</h4>
                          <ul className="text-sm space-y-1">
                            {suggestion.riskFactors.map((factor, i) => (
                              <li key={i} className="flex items-start">
                                <AlertCircle className="w-4 h-4 mr-2 text-orange-600 mt-0.5" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3">
                        <h4 className="font-medium mb-1">随访建议</h4>
                        <p className="text-sm">{suggestion.followUp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}