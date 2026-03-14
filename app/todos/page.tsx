'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, FileText, User, Calendar } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface TodoItem {
  id: string
  type: 'record' | 'review' | 'followup'
  title: string
  description: string
  patientName: string
  patientId: string
  recordId?: string
  priority: 'high' | 'medium' | 'low'
  createdAt: string
  dueDate?: string
}

export default function TodosPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/todos')
      if (response.ok) {
        const data = await response.json()
        setTodos(data.todos)
      } else {
        console.error('Failed to fetch todos')
      }
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">高优先级</Badge>
      case 'medium':
        return <Badge variant="warning">中优先级</Badge>
      case 'low':
        return <Badge variant="secondary">低优先级</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'record':
        return <FileText className="w-5 h-5 text-blue-500" />
      case 'review':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'followup':
        return <Clock className="w-5 h-5 text-orange-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'record':
        return '待确认病历'
      case 'review':
        return '待审核病历'
      case 'followup':
        return '随访提醒'
      default:
        return type
    }
  }

  const filteredTodos = filter === 'all' 
    ? todos 
    : todos.filter(todo => todo.priority === filter)

  const getPriorityCount = (priority: string) => {
    return todos.filter(todo => todo.priority === priority).length
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
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">今日待办</h1>
                <p className="text-sm text-gray-600">智能病历平台 - 待办事项管理</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              全部 ({todos.length})
            </Button>
            <Button
              variant={filter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
            >
              高优先级 ({getPriorityCount('high')})
            </Button>
            <Button
              variant={filter === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('medium')}
            >
              中优先级 ({getPriorityCount('medium')})
            </Button>
            <Button
              variant={filter === 'low' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('low')}
            >
              低优先级 ({getPriorityCount('low')})
            </Button>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>待办事项</CardTitle>
            <CardDescription>
              共 {filteredTodos.length} 项待处理事项
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-gray-500">加载中...</div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-300" />
                <p className="text-lg font-medium mb-2">太棒了！</p>
                <p>当前没有待处理事项</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getTypeIcon(todo.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {todo.title}
                            </h3>
                            {getPriorityBadge(todo.priority)}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {todo.description}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{todo.patientName}</span>
                            </div>
                            {todo.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  截止：{format(new Date(todo.dueDate), 'MM-dd HH:mm', { locale: zhCN })}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {format(new Date(todo.createdAt), 'MM-dd HH:mm', { locale: zhCN })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {todo.recordId ? (
                          <Link href={`/records/${todo.recordId}`}>
                            <Button variant="outline" size="sm">
                              查看详情
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/patients/${todo.patientId}`}>
                            <Button variant="outline" size="sm">
                              查看患者
                            </Button>
                          </Link>
                        )}
                      </div>
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