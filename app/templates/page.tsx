'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, Edit, Trash2, Save, FileText } from 'lucide-react'
import Link from 'next/link'

interface TemplateField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'date' | 'number'
  required: boolean
  defaultValue?: any
  options?: string[]
}

interface MedicalTemplate {
  id: string
  name: string
  type: string
  department: string
  fields: TemplateField[]
  rules: any[]
  createdAt: string
  updatedAt: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<MedicalTemplate[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<MedicalTemplate | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'outpatient',
    department: '',
    fields: [
      { id: '1', label: '主诉', type: 'textarea', required: true },
      { id: '2', label: '现病史', type: 'textarea', required: true },
      { id: '3', label: '既往史', type: 'textarea', required: false },
      { id: '4', label: '家族史', type: 'textarea', required: false },
      { id: '5', label: '体格检查', type: 'textarea', required: true },
      { id: '6', label: '诊断', type: 'textarea', required: true },
      { id: '7', label: '治疗方案', type: 'textarea', required: true }
    ] as TemplateField[],
    rules: []
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsCreating(false)
        setFormData({
          name: '',
          type: 'outpatient',
          department: '',
          fields: [
            { id: '1', label: '主诉', type: 'textarea', required: true },
            { id: '2', label: '现病史', type: 'textarea', required: true },
            { id: '3', label: '既往史', type: 'textarea', required: false },
            { id: '4', label: '家族史', type: 'textarea', required: false },
            { id: '5', label: '体格检查', type: 'textarea', required: true },
            { id: '6', label: '诊断', type: 'textarea', required: true },
            { id: '7', label: '治疗方案', type: 'textarea', required: true }
          ] as TemplateField[],
          rules: []
        })
        fetchTemplates()
      }
    } catch (error) {
      console.error('Error creating template:', error)
      alert('创建模版失败')
    }
  }

  const handleUpdate = async () => {
    if (!editingTemplate) return

    try {
      const response = await fetch(`/api/templates/${editingTemplate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setEditingTemplate(null)
        setFormData({
          name: '',
          type: 'outpatient',
          department: '',
          fields: [
            { id: '1', label: '主诉', type: 'textarea', required: true },
            { id: '2', label: '现病史', type: 'textarea', required: true },
            { id: '3', label: '既往史', type: 'textarea', required: false },
            { id: '4', label: '家族史', type: 'textarea', required: false },
            { id: '5', label: '体格检查', type: 'textarea', required: true },
            { id: '6', label: '诊断', type: 'textarea', required: true },
            { id: '7', label: '治疗方案', type: 'textarea', required: true }
          ] as TemplateField[],
          rules: []
        })
        fetchTemplates()
      }
    } catch (error) {
      console.error('Error updating template:', error)
      alert('更新模版失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个模版吗？')) return

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchTemplates()
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('删除模版失败')
    }
  }

  const handleEdit = (template: MedicalTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      type: template.type,
      department: template.department,
      fields: template.fields,
      rules: template.rules
    })
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingTemplate(null)
    setFormData({
      name: '',
      type: 'outpatient',
      department: '',
      fields: [
        { id: '1', label: '主诉', type: 'textarea', required: true },
        { id: '2', label: '现病史', type: 'textarea', required: true },
        { id: '3', label: '既往史', type: 'textarea', required: false },
        { id: '4', label: '家族史', type: 'textarea', required: false },
        { id: '5', label: '体格检查', type: 'textarea', required: true },
        { id: '6', label: '诊断', type: 'textarea', required: true },
        { id: '7', label: '治疗方案', type: 'textarea', required: true }
      ] as TemplateField[],
      rules: []
    })
  }

  const addField = () => {
    const newField: TemplateField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: false
    }
    setFormData({
      ...formData,
      fields: [...formData.fields, newField]
    })
  }

  const updateField = (index: number, field: Partial<TemplateField>) => {
    const updatedFields = [...formData.fields]
    updatedFields[index] = { ...updatedFields[index], ...field }
    setFormData({
      ...formData,
      fields: updatedFields
    })
  }

  const removeField = (index: number) => {
    const updatedFields = formData.fields.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      fields: updatedFields
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">病历模版管理</h1>
              <p className="text-sm text-gray-600">创建和管理病历模版</p>
            </div>
            {!isCreating && !editingTemplate && (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                新建模版
              </Button>
            )}
          </div>
        </header>

        {(isCreating || editingTemplate) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingTemplate ? '编辑模版' : '新建模版'}
              </CardTitle>
              <CardDescription>
                配置模版的基本信息和字段
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">模版名称 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：门诊病历"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">模版类型 *</Label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="outpatient">门诊病历</option>
                    <option value="inpatient">住院病历</option>
                    <option value="emergency">急诊病历</option>
                    <option value="specialty">专科病历</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">科室</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="例如：内科、外科、儿科"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>模版字段</Label>
                  <Button size="sm" variant="outline" onClick={addField}>
                    <Plus className="w-4 h-4 mr-1" />
                    添加字段
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.fields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor={`field-label-${index}`}>字段名称</Label>
                              <Input
                                id={`field-label-${index}`}
                                value={field.label}
                                onChange={(e) => updateField(index, { label: e.target.value })}
                                placeholder="例如：主诉"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`field-type-${index}`}>字段类型</Label>
                              <select
                                id={`field-type-${index}`}
                                className="w-full px-3 py-2 border rounded-md"
                                value={field.type}
                                onChange={(e) => updateField(index, { type: e.target.value as any })}
                              >
                                <option value="text">文本</option>
                                <option value="textarea">多行文本</option>
                                <option value="select">下拉选择</option>
                                <option value="date">日期</option>
                                <option value="number">数字</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(index, { required: e.target.checked })}
                              />
                              <span className="text-sm">必填</span>
                            </label>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeField(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={editingTemplate ? handleUpdate : handleCreate}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingTemplate ? '更新模版' : '创建模版'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>模版列表</CardTitle>
            <CardDescription>
              共 {templates.length} 个模版
            </CardDescription>
          </CardHeader>
          <CardContent>
            {templates.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>暂无模版</p>
                {!isCreating && (
                  <Button className="mt-4" onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    创建第一个模版
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {template.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {template.type === 'outpatient' && '门诊病历'}
                        {template.type === 'inpatient' && '住院病历'}
                        {template.type === 'emergency' && '急诊病历'}
                        {template.type === 'specialty' && '专科病历'}
                        {template.department && ` · ${template.department}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {template.fields.length} 个字段 · 
                        {new Date(template.createdAt).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}