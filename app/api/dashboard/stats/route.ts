import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/client'

interface DashboardStats {
  overview: {
    totalPatients: number
    totalRecords: number
    pendingRecords: number
    completedRecords: number
    todayRecords: number
    todayPatients: number
  }
  diagnosisDistribution: {
    diagnosis: string
    count: number
    percentage: number
  }[]
  qualityDistribution: {
    grade: string
    count: number
    percentage: number
  }[]
  departmentDistribution: {
    department: string
    count: number
    percentage: number
  }[]
  monthlyTrend: {
    month: string
    patients: number
    records: number
  }[]
  followUpStats: {
    pending: number
    completed: number
    overdue: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const stats = await calculateDashboardStats(days)

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error calculating dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to calculate dashboard stats' },
      { status: 500 }
    )
  }
}

async function calculateDashboardStats(days: number): Promise<DashboardStats> {
  const now = new Date()
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [
    totalPatients,
    totalRecords,
    pendingRecords,
    completedRecords,
    todayRecords,
    todayPatients,
    allRecords,
    allPatients,
    followUps
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.medicalRecord.count(),
    prisma.medicalRecord.count({ where: { status: 'draft' } }),
    prisma.medicalRecord.count({ where: { status: 'approved' } }),
    prisma.medicalRecord.count({
      where: {
        createdAt: {
          gte: todayStart
        }
      }
    }),
    prisma.patient.count({
      where: {
        createdAt: {
          gte: todayStart
        }
      }
    }),
    prisma.medicalRecord.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        patient: true
      }
    }),
    prisma.patient.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    }),
    prisma.followUp.findMany()
  ])

  const overview = {
    totalPatients,
    totalRecords,
    pendingRecords,
    completedRecords,
    todayRecords,
    todayPatients
  }

  const diagnosisDistribution = calculateDiagnosisDistribution(allRecords)
  const qualityDistribution = calculateQualityDistribution(allRecords)
  const departmentDistribution = calculateDepartmentDistribution(allRecords)
  const monthlyTrend = calculateMonthlyTrend(allRecords, allPatients, days)
  const followUpStats = calculateFollowUpStats(followUps)

  return {
    overview,
    diagnosisDistribution,
    qualityDistribution,
    departmentDistribution,
    monthlyTrend,
    followUpStats
  }
}

function calculateDiagnosisDistribution(records: any[]): DashboardStats['diagnosisDistribution'] {
  const diagnosisMap = new Map<string, number>()

  records.forEach(record => {
    const diagnosis = record.diagnosis || '未诊断'
    diagnosisMap.set(diagnosis, (diagnosisMap.get(diagnosis) || 0) + 1)
  })

  const total = records.length
  const distribution = Array.from(diagnosisMap.entries())
    .map(([diagnosis, count]) => ({
      diagnosis,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return distribution
}

function calculateQualityDistribution(records: any[]): DashboardStats['qualityDistribution'] {
  const qualityMap = new Map<string, number>()

  records.forEach(record => {
    const score = record.qualityScore || 0
    let grade = 'D'
    if (score >= 90) grade = 'A'
    else if (score >= 80) grade = 'B'
    else if (score >= 70) grade = 'C'

    qualityMap.set(grade, (qualityMap.get(grade) || 0) + 1)
  })

  const total = records.length
  const distribution = Array.from(qualityMap.entries())
    .map(([grade, count]) => ({
      grade,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)

  return distribution
}

function calculateDepartmentDistribution(records: any[]): DashboardStats['departmentDistribution'] {
  const departmentMap = new Map<string, number>()

  records.forEach(record => {
    const department = record.template?.department || '未分类'
    departmentMap.set(department, (departmentMap.get(department) || 0) + 1)
  })

  const total = records.length
  const distribution = Array.from(departmentMap.entries())
    .map(([department, count]) => ({
      department,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)

  return distribution
}

function calculateMonthlyTrend(
  records: any[],
  patients: any[],
  days: number
): DashboardStats['monthlyTrend'] {
  const monthMap = new Map<string, { patients: number; records: number }>()

  const months = Math.ceil(days / 30)
  for (let i = 0; i < months; i++) {
    const monthDate = new Date()
    monthDate.setMonth(monthDate.getMonth() - i)
    const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
    monthMap.set(monthKey, { patients: 0, records: 0 })
  }

  records.forEach(record => {
    const date = new Date(record.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const data = monthMap.get(monthKey)
    if (data) {
      data.records++
    }
  })

  patients.forEach(patient => {
    const date = new Date(patient.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const data = monthMap.get(monthKey)
    if (data) {
      data.patients++
    }
  })

  const trend = Array.from(monthMap.entries())
    .map(([month, data]) => ({
      month,
      patients: data.patients,
      records: data.records
    }))
    .reverse()

  return trend
}

function calculateFollowUpStats(followUps: any[]): DashboardStats['followUpStats'] {
  const now = new Date()

  let pending = 0
  let completed = 0
  let overdue = 0

  followUps.forEach(followUp => {
    if (followUp.status === 'completed') {
      completed++
    } else if (followUp.status === 'pending') {
      pending++
      const followUpDate = new Date(followUp.followUpDate)
      if (followUpDate < now) {
        overdue++
      }
    }
  })

  return {
    pending,
    completed,
    overdue
  }
}