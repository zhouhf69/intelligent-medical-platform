import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token: generateToken(user.id)
    })
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  }
}

function generateToken(userId: string): string {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64')
}