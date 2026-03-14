'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Mail, Phone, Github, Heart, Shield, Zap } from 'lucide-react'

export default function AboutPage() {
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
        </header>

        <div className="space-y-6">
          <Card className="text-center py-8">
            <CardContent>
              <div className="w-20 h-20 bg-medical-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">智能病历平台</h1>
              <p className="text-lg text-gray-600 mb-4">智能病历源头生成与全流程质控平台</p>
              <p className="text-sm text-gray-500">版本 1.0.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>平台特色</CardTitle>
              <CardDescription>为您提供专业的病历管理解决方案</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold mb-1">智能录入</h3>
                  <p className="text-sm text-gray-600">支持语音输入，快速录入病历信息</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold mb-1">全流程质控</h3>
                  <p className="text-sm text-gray-600">从创建到审核，全程质量把控</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <h3 className="font-semibold mb-1">患者关怀</h3>
                  <p className="text-sm text-gray-600">完善的患者信息管理，贴心服务</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>开发者信息</CardTitle>
              <CardDescription>联系与支持</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">开发者</div>
                    <div className="font-semibold text-lg">周宏锋</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">联系电话</div>
                    <div className="font-semibold text-lg">13609737049</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">电子邮箱</div>
                    <div className="font-semibold text-lg">13609737049@139.com</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>技术栈</CardTitle>
              <CardDescription>使用现代化技术构建</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-sm">Next.js 14</div>
                  <div className="text-xs text-gray-500">前端框架</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-sm">TypeScript</div>
                  <div className="text-xs text-gray-500">类型安全</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-sm">Prisma</div>
                  <div className="text-xs text-gray-500">ORM</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-sm">PostgreSQL</div>
                  <div className="text-xs text-gray-500">数据库</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-sm">Tailwind CSS</div>
                  <div className="text-xs text-gray-500">样式框架</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-sm">Radix UI</div>
                  <div className="text-xs text-gray-500">组件库</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-sm">Zustand</div>
                  <div className="text-xs text-gray-500">状态管理</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-sm">Web Speech API</div>
                  <div className="text-xs text-gray-500">语音识别</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>功能特性</CardTitle>
              <CardDescription>完整的病历管理功能</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-medical-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">患者信息管理</div>
                    <div className="text-sm text-gray-600">完整的患者信息录入、编辑和查询</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-medical-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">病历管理</div>
                    <div className="text-sm text-gray-600">创建、编辑、审核病历</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-medical-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">语音输入</div>
                    <div className="text-sm text-gray-600">支持中文语音识别，快速录入</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-medical-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">状态管理</div>
                    <div className="text-sm text-gray-600">草稿、已提交、已审核、已驳回</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-medical-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">数据导出</div>
                    <div className="text-sm text-gray-600">支持 CSV 格式导出</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-medical-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">统计分析</div>
                    <div className="text-sm text-gray-600">数据统计和可视化展示</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-medical-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">打印功能</div>
                    <div className="text-sm text-gray-600">支持病历打印</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-medical-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">待办事项</div>
                    <div className="text-sm text-gray-600">查看待处理事项</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                感谢您使用智能病历平台！
              </p>
              <p className="text-sm text-gray-500">
                如有任何问题或建议，欢迎联系我们
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}