'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Users, Search, Plus, Calendar, Phone, FileText, ArrowLeft, Edit } from 'lucide-react'
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
  records?: Array<{
    id: string
    status: string
    createdAt: string
  }>
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPatients()
  }, [currentPage, searchQuery])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchQuery && { search: searchQuery }),
      })

      const response = await fetch(`/api/patients?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPatients(data.patients)
        setTotalPages(data.pagination.totalPages)
      } else {
        console.error('Failed to fetch patients:', data.error)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const getGenderText = (gender: string) => {
    return gender === 'male' ? '男' : gender === 'female' ? '女' : gender
  }

  const getLatestRecordStatus = (records?: Array<{ status: string }>) => {
    if (!records || records.length === 0) return null
    const latestRecord = records[0]
    return latestRecord.status
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回
                </Button>
              </Link>
              <div className="w-12 h-12 bg-medical-500 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">患者管理</h1>
                <p className="text-sm text-gray-600">智能病历平台 - 患者信息管理</p>
              </div>
            </div>
            <Link href="/patients/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                新建患者
              </Button>
            </Link>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="搜索患者姓名、身份证号或电话..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>患者列表</CardTitle>
            <CardDescription>
              共 {patients.length} 位患者，第 {currentPage} / {totalPages} 页
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-gray-500">加载中...</div>
            ) : patients.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>暂无患者数据</p>
                <Link href="/patients/new">
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    添加第一位患者
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {patient.name}
                          </h3>
                          <Badge variant="outline">
                            {getGenderText(patient.gender)} · {patient.age}岁
                          </Badge>
                          {getStatusBadge(getLatestRecordStatus(patient.records))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{patient.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>
                              入院：{format(new Date(patient.admissionDate), 'yyyy-MM-dd', { locale: zhCN })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span>
                              病历：{patient.records?.length || 0} 份
                            </span>
                          </div>
                        </div>

                        {patient.idCard && (
                          <div className="mt-2 text-sm text-gray-500">
                            身份证：{patient.idCard}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/patients/${patient.id}`}>
                          <Button variant="outline" size="sm">
                            查看详情
                          </Button>
                        </Link>
                        <Link href={`/patients/${patient.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            编辑
                          </Button>
                        </Link>
                        <Link href={`/patients/${patient.id}/records/new`}>
                          <Button size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            新建病历
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                <span className="text-sm text-gray-600">
                  第 {currentPage} / {totalPages} 页
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}