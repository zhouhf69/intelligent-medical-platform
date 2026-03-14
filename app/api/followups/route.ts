import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const recordId = searchParams.get('recordId')
    const patientId = searchParams.get('patientId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    const where = recordId ? { recordId } : patientId ? { record: { patientId } } : {}

    const [followUps, total] = await Promise.all([
      prisma.followUp.findMany({
        where,
        skip,
        take: limit,
        orderBy: { followUpDate: 'desc' },
        include: {
          record: {
            include: {
              patient: true
            }
          }
        }
      }),
      prisma.followUp.count({ where })
    ])

    return NextResponse.json({
      followUps,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching follow-ups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch follow-ups' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recordId, followUpDate, type, notes } = body

    const followUp = await prisma.followUp.create({
      data: {
        recordId,
        followUpDate: new Date(followUpDate),
        type,
        notes,
        status: 'pending'
      },
      include: {
        record: {
          include: {
            patient: true
          }
        }
      }
    })

    return NextResponse.json(followUp, { status: 201 })
  } catch (error) {
    console.error('Error creating follow-up:', error)
    return NextResponse.json(
      { error: 'Failed to create follow-up' },
      { status: 500 }
    )
  }
}