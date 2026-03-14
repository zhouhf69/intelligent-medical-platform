import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const recordId = searchParams.get('recordId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    const where = recordId ? { recordId } : {}

    const [collaborations, total] = await Promise.all([
      prisma.collaboration.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          record: {
            include: {
              patient: true
            }
          }
        }
      }),
      prisma.collaboration.count({ where })
    ])

    return NextResponse.json({
      collaborations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching collaborations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collaborations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recordId, department, doctor, comment } = body

    const collaboration = await prisma.collaboration.create({
      data: {
        recordId,
        department,
        doctor,
        comment,
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

    return NextResponse.json(collaboration, { status: 201 })
  } catch (error) {
    console.error('Error creating collaboration:', error)
    return NextResponse.json(
      { error: 'Failed to create collaboration' },
      { status: 500 }
    )
  }
}