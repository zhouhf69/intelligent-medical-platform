import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/client'

export async function GET(request: NextRequest) {
  try {
    const totalPatients = await prisma.patient.count()
    const totalRecords = await prisma.medicalRecord.count()
    const draftRecords = await prisma.medicalRecord.count({
      where: { status: 'draft' },
    })
    const submittedRecords = await prisma.medicalRecord.count({
      where: { status: 'submitted' },
    })
    const approvedRecords = await prisma.medicalRecord.count({
      where: { status: 'approved' },
    })

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const recentPatients = await prisma.patient.count({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    })

    const recentRecords = await prisma.medicalRecord.count({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    })

    return NextResponse.json({
      totalPatients,
      totalRecords,
      draftRecords,
      submittedRecords,
      approvedRecords,
      recentPatients,
      recentRecords,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}