import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'patients'
    const format = searchParams.get('format') || 'json'

    if (type === 'patients') {
      const patients = await prisma.patient.findMany({
        include: {
          records: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      if (format === 'csv') {
        const headers = ['ID', '姓名', '年龄', '性别', '身份证号', '电话', '入院日期', '病历数量']
        const rows = patients.map(p => [
          p.id,
          p.name,
          p.age,
          p.gender === 'male' ? '男' : '女',
          p.idCard || '',
          p.phone,
          new Date(p.admissionDate).toLocaleDateString('zh-CN'),
          p.records.length,
        ])

        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n')

        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="patients.csv"',
          },
        })
      }

      return NextResponse.json({ patients })
    }

    if (type === 'records') {
      const records = await prisma.medicalRecord.findMany({
        include: {
          patient: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      if (format === 'csv') {
        const headers = ['ID', '患者姓名', '主诉', '诊断', '状态', '创建日期']
        const rows = records.map(r => [
          r.id,
          r.patient.name,
          r.chiefComplaint,
          r.diagnosis,
          r.status,
          new Date(r.createdAt).toLocaleDateString('zh-CN'),
        ])

        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n')

        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="records.csv"',
          },
        })
      }

      return NextResponse.json({ records })
    }

    return NextResponse.json(
      { error: 'Invalid type. Use "patients" or "records"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}