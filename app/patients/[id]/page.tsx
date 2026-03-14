'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, Phone, Calendar, CreditCard, FileText, Plus, Edit } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

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
  id: string
  patientId: string
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

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPatientDetails()
      fetchPatientRecords()
    }
  }, [params.id])

  const fetchPatientDetails = async () => {
    try {
      const response = await fetch(`/api/patients/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPatient(data)
      } else {
        console.error('Failed to fetch patient details')
      }
    } catch (error) {
      console.error('Error fetching patient details:', error)
    }
  }

  const fetchPatientRecords = async () => {
    try {
      const response = await fetch(`/api/records?patientId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setRecords(data.records)
      } else {
        console.error('Failed to fetch patient records')
      }
    } catch (error) {
      console.error('Error fetching patient records:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGenderText = (gender: string) => {
    return gender === 'male' ? '男' : gender === 'female' ? '女' : gender
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">草稿</Badge>
      case 'submitted':
        return <Badge variant="default">已提交</Badge>
      case 'approved':
        return <Badge variant="success">已审核</Badge>
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
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-6">
          <Link href="/patients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回患者列表
            </Button>
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-sm text-gray-600">患者详情与病历记录</p>
            </div>
            <Link href={`/patients/${patient.id}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                编辑信息
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">姓名</div>
                  <div className="font-semibold">{patient.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">性别</div>
                    <div className="font-semibold">{getGenderText(patient.gender)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">年龄</div>
                    <div className="font-semibold">{patient.age}岁</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    身份证号
                  </div>
                  <div className="font-semibold">{patient.idCard || '未填写'}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    联系电话
                  </div>
                  <div className="font-semibold">{patient.phone}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    入院日期
                  </div>
                  <div className="font-semibold">
                    {format(new Date(patient.admissionDate), 'yyyy年MM月dd日', { locale: zhCN })}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-500 mb-1">创建时间</div>
                  <div className="text-sm">
                    {format(new Date(patient.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      病历记录
                    </CardTitle>
                    <CardDescription>
                      共 {records.length} 份病历
                    </CardDescription>
                  </div>
                  <Link href={`/patients/${patient.id}/records/new`}>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      新建病历
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {records.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>暂无病历记录</p>
                    <Link href={`/patients/${patient.id}/records/new`}>
                      <Button className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        创建第一份病历
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {records.map((record) => (
                      <div
                        key={record.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {record.diagnosis}
                              </h3>
                              {getStatusBadge(record.status)}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">主诉：</span>
                              {record.chiefComplaint}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(record.createdAt), 'yyyy-MM-dd', { locale: zhCN })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">现病史：</span>
                            <span className="text-gray-700 line-clamp-2">
                              {record.presentIllness}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">体格检查：</span>
                            <span className="text-gray-700 line-clamp-2">
                              {record.physicalExam}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t flex gap-2">
                          <Link href={`/records/${record.id}`}>
                            <Button variant="outline" size="sm">
                              查看详情
                            </Button>
                          </Link>
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
    </div>
  )
}