'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, User, Phone, Calendar, CreditCard } from 'lucide-react'
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

export default function EditPatientPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    idCard: '',
    phone: '',
    admissionDate: '',
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
        setFormData({
          name: data.name,
          age: data.age.toString(),
          gender: data.gender,
          idCard: data.idCard || '',
          phone: data.phone,
          admissionDate: data.admissionDate.split('T')[0],
        })
      } else {
        console.error('Failed to fetch patient details')
      }
    } catch (error) {
      console.error('Error fetching patient details:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.age || !formData.gender || !formData.phone || !formData.admissionDate) {
      toast({
        variant: 'destructive',
        title: '验证失败',
        description: '请填写所有必填字段',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/patients/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
        }),
      })

      if (response.ok) {
        toast({
          title: '更新成功',
          description: '患者信息已成功更新',
        })
        router.push(`/patients/${params.id}`)
      } else {
        const data = await response.json()
        throw new Error(data.error || '更新失败')
      }
    } catch (error) {
      console.error('Error updating patient:', error)
      toast({
        variant: 'destructive',
        title: '更新失败',
        description: error instanceof Error ? error.message : '请稍后重试',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100 flex items-center justify-center">
        <div className="text-center text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <header className="mb-6">
          <Link href={`/patients/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回患者详情
            </Button>
          </Link>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">编辑患者</h1>
            <p className="text-sm text-gray-600">更新患者的基本信息</p>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              患者基本信息
            </CardTitle>
            <CardDescription>修改患者的基本信息，带 * 的为必填项</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  姓名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="请输入患者姓名"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">
                    年龄 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="年龄"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    required
                    min="0"
                    max="150"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">
                    性别 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleChange('gender', value)}
                    required
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="请选择性别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男</SelectItem>
                      <SelectItem value="female">女</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idCard">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  身份证号
                </Label>
                <Input
                  id="idCard"
                  placeholder="请输入身份证号"
                  value={formData.idCard}
                  onChange={(e) => handleChange('idCard', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="w-4 h-4 inline mr-1" />
                  联系电话 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入联系电话"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  pattern="[0-9]*"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionDate">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  入院日期 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => handleChange('admissionDate', e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? '保存中...' : '保存患者信息'}
                </Button>
                <Link href={`/patients/${params.id}`} className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    取消
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}