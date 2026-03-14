import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const priority = searchParams.get('priority')

    const draftRecords = await prisma.medicalRecord.findMany({
      where: {
        status: 'draft',
      },
      include: {
        patient: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const submittedRecords = await prisma.medicalRecord.findMany({
      where: {
        status: 'submitted',
      },
      include: {
        patient: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const todos = [
      ...draftRecords.map(record => ({
        id: `draft-${record.id}`,
        type: 'record' as const,
        title: `待确认病历 - ${record.patient.name}`,
        description: record.chiefComplaint,
        patientName: record.patient.name,
        patientId: record.patientId,
        recordId: record.id,
        priority: 'medium' as const,
        createdAt: record.createdAt,
        dueDate: new Date(record.createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      })),
      ...submittedRecords.map(record => ({
        id: `review-${record.id}`,
        type: 'review' as const,
        title: `待审核病历 - ${record.patient.name}`,
        description: record.chiefComplaint,
        patientName: record.patient.name,
        patientId: record.patientId,
        recordId: record.id,
        priority: 'high' as const,
        createdAt: record.createdAt,
        dueDate: new Date(record.createdAt.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      })),
    ]

    const filteredTodos = priority && priority !== 'all'
      ? todos.filter(todo => todo.priority === priority)
      : todos

    return NextResponse.json({ todos: filteredTodos })
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    )
  }
}