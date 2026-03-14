import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const type = formData.get('type') as string

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    if (!type || !['id_card', 'medical_record'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      )
    }

    const arrayBuffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const mimeType = imageFile.type
    const imageDataUrl = `data:${mimeType};base64,${base64}`

    try {
      const extractedData = await performOCR(imageDataUrl, type)
      
      return NextResponse.json({
        success: true,
        extractedData,
        confidence: 0.85
      })
    } catch (error) {
      console.error('OCR error:', error)
      
      return NextResponse.json({
        success: false,
        error: 'OCR recognition failed',
        message: '图像识别失败，请确保图片清晰且光线充足'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}

async function performOCR(imageDataUrl: string, type: string): Promise<any> {
  return new Promise((resolve) => {
    const mockData = getMockData(type)
    mockData.rawText = '模拟OCR结果（实际部署时需要集成真实OCR服务，如百度OCR、腾讯云OCR等）'
    resolve(mockData)
  })
}

function extractDataFromText(text: string, type: string): any {
  const extractedData: any = {}

  if (type === 'id_card') {
    const nameMatch = text.match(/姓名[：:]\s*([^\n\r]+)/)
    if (nameMatch) extractedData.name = nameMatch[1].trim()

    const idCardMatch = text.match(/(?:身份证|公民身份号码)[：:]\s*([0-9X]{18})/)
    if (idCardMatch) extractedData.idCard = idCardMatch[1]

    const genderMatch = text.match(/性别[：:]\s*([男女])/)
    if (genderMatch) {
      extractedData.gender = genderMatch[1] === '男' ? 'male' : 'female'
    }

    const ageMatch = text.match(/年龄[：:]\s*(\d+)/)
    if (ageMatch) extractedData.age = parseInt(ageMatch[1])

    const phoneMatch = text.match(/(?:电话|手机)[：:]\s*(\d{11})/)
    if (phoneMatch) extractedData.phone = phoneMatch[1]

    const addressMatch = text.match(/(?:住址|地址)[：:]\s*([^\n\r]+)/)
    if (addressMatch) extractedData.address = addressMatch[1].trim()
  } else if (type === 'medical_record') {
    const diagnosisMatch = text.match(/(?:诊断|初步诊断)[：:]\s*([^\n\r]+)/)
    if (diagnosisMatch) extractedData.diagnosis = diagnosisMatch[1].trim()

    const treatmentMatch = text.match(/(?:治疗|诊疗计划|治疗方案)[：:]\s*([^\n\r]+)/)
    if (treatmentMatch) extractedData.treatment = treatmentMatch[1].trim()
  }

  return extractedData
}

function getMockData(type: string): any {
  if (type === 'id_card') {
    return {
      name: '张三',
      idCard: '110101199001011234',
      gender: 'male',
      age: 34,
      phone: '13800138000',
      address: '北京市东城区某某街道123号'
    }
  } else {
    return {
      diagnosis: '高血压病（2级，很高危）',
      treatment: '1. 降压治疗：氨氯地平5mg qd\n2. 生活方式干预：低盐低脂饮食，适量运动\n3. 定期监测血压，每周至少3次'
    }
  }
}