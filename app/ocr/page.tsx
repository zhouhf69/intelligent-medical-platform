'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Camera, Upload, FileText, Download, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

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

export default function OCRPage() {
  const [selectedType, setSelectedType] = useState<'id_card' | 'medical_record'>('id_card')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()

      const canvas = document.createElement('canvas')
      canvas.width = 1280
      canvas.height = 720
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        setTimeout(() => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
              processImage(file)
            }
            stream.getTracks().forEach(track => track.stop())
          }, 'image/jpeg', 0.9)
        }, 1000)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('无法访问摄像头，请检查权限设置')
    }
  }

  const processImage = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
      setImageFile(file)
    }
    reader.readAsDataURL(file)
  }

  const recognizeImage = async () => {
    if (!imageFile) return

    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('type', selectedType)

      const response = await fetch('/api/ocr/recognize', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setExtractedData(data.extractedData)
        
        const newDocument = {
          id: Date.now().toString(),
          type: selectedType,
          imageUrl: imagePreview,
          extractedData: data.extractedData,
          createdAt: new Date()
        }

        setDocuments(prev => [newDocument, ...prev])
      } else {
        throw new Error('Recognition failed')
      }
    } catch (error) {
      console.error('Error recognizing image:', error)
      alert('图像识别失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = (document: any) => {
    const link = document.createElement('a')
    link.href = document.imageUrl
    link.download = `${document.type}-${document.id}.jpg`
    link.click()
  }

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
  }

  const useExtractedData = () => {
    if (extractedData) {
      localStorage.setItem('extractedData', JSON.stringify(extractedData))
      alert('识别数据已保存，可以在病历创建页面使用')
    }
  }

  const resetForm = () => {
    setImagePreview(null)
    setImageFile(null)
    setExtractedData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">图像识别</h1>
            <p className="text-sm text-gray-600">识别身份证和病历资料</p>
          </div>
        </header>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>选择识别类型</CardTitle>
              <CardDescription>选择要识别的文档类型</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={selectedType === 'id_card' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('id_card')}
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  身份证
                </Button>
                <Button
                  variant={selectedType === 'medical_record' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('medical_record')}
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  病历资料
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>上传图像</CardTitle>
              <CardDescription>拍照或上传图片进行识别</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={handleCameraCapture} className="flex-1">
                  <Camera className="w-4 h-4 mr-2" />
                  拍照
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  上传图片
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {imagePreview && (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full rounded-lg"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={recognizeImage}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? '识别中...' : '开始识别'}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      重新选择
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {extractedData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  识别结果
                </CardTitle>
                <CardDescription>提取的信息如下</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedType === 'id_card' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">姓名</div>
                        <div className="font-semibold">{extractedData.name || '未识别'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">性别</div>
                        <div className="font-semibold">
                          {extractedData.gender === 'male' ? '男' : extractedData.gender === 'female' ? '女' : '未识别'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">年龄</div>
                        <div className="font-semibold">{extractedData.age || '未识别'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">电话</div>
                        <div className="font-semibold">{extractedData.phone || '未识别'}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">身份证号</div>
                      <div className="font-semibold">{extractedData.idCard || '未识别'}</div>
                    </div>
                    {extractedData.address && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">地址</div>
                        <div className="font-semibold">{extractedData.address}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">诊断</div>
                      <div className="font-semibold">{extractedData.diagnosis || '未识别'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">治疗方案</div>
                      <div className="font-semibold">{extractedData.treatment || '未识别'}</div>
                    </div>
                    {extractedData.rawText && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">原始文本</div>
                        <div className="p-3 bg-gray-50 rounded-lg text-sm">
                          {extractedData.rawText}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Button onClick={useExtractedData}>
                  使用此识别数据
                </Button>
              </CardContent>
            </Card>
          )}

          {documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>识别历史</CardTitle>
                <CardDescription>共 {documents.length} 条记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={doc.imageUrl}
                        alt={doc.type}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {doc.type === 'id_card' ? '身份证' : '病历资料'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(doc.createdAt).toLocaleString('zh-CN')}
                        </div>
                        {doc.extractedData.name && (
                          <div className="text-xs text-gray-600">
                            姓名: {doc.extractedData.name}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => downloadImage(doc)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}