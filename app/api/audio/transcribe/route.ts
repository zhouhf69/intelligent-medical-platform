import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    const arrayBuffer = await audioFile.arrayBuffer()
    const size = arrayBuffer.byteLength
    const duration = Math.round(size / 8000)

    const mockTranscription = getMockTranscription(duration)
    
    return NextResponse.json({
      success: true,
      text: mockTranscription,
      confidence: 0.95,
      note: '当前使用模拟转录结果。生产环境需要集成真实的语音识别服务（如Azure Speech Service或阿里云语音识别）。'
    })
  } catch (error) {
    console.error('Error processing audio:', error)
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    )
  }
}

function getMockTranscription(duration: number): string {
  const scenarios = [
    '患者主诉反复咳嗽、咳痰3年，加重1周。现病史：患者3年前无明显诱因出现咳嗽、咳痰，为白色黏痰，量中等，晨起明显，无发热、胸闷、气促。曾在外院就诊，诊断为慢性支气管炎，给予抗感染、止咳化痰治疗后症状缓解。1周前患者受凉后上述症状再次出现，并伴有活动后气促，无发热、胸痛、咯血。',
    '患者因头晕、头痛2天就诊。现病史：患者2天前无明显诱因出现头晕、头痛，呈持续性，伴恶心、呕吐，呕吐物为胃内容物，非喷射性，无发热、意识障碍。既往史：有高血压病史10年，最高血压180/110mmHg，长期服用降压药物，血压控制尚可。否认糖尿病、冠心病病史。',
    '患者因腹痛、腹胀1天就诊。现病史：患者1天前进食油腻食物后出现上腹部持续性胀痛，伴恶心、呕吐，呕吐物为胃内容物，无发热、黄疸。既往史：有胆囊结石病史3年，未手术治疗。否认其他慢性病史。',
    '患者因胸闷、心悸3小时就诊。现病史：患者3小时前无明显诱因出现胸闷、心悸，呈持续性，伴出汗，无胸痛、呼吸困难。既往史：有冠心病病史5年，曾行冠脉造影术，植入支架2枚。否认其他慢性病史。',
    '患者因右下腹疼痛6小时就诊。现病史：患者6小时前无明显诱因出现右下腹持续性疼痛，伴恶心、呕吐，无发热、腹泻。既往史：否认慢性病史。否认手术外伤史。'
  ]

  return scenarios[Math.floor(Math.random() * scenarios.length)]
}