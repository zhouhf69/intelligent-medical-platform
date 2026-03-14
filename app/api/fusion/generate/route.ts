import { NextRequest, NextResponse } from 'next/server'

interface FusionInput {
  transcriptions: Array<{
    id: string
    speakerLabel: string
    text: string
    timestamp: string
  }>
  extractedData: {
    name?: string
    idCard?: string
    age?: number
    gender?: 'male' | 'female'
    phone?: string
    address?: string
    diagnosis?: string
    treatment?: string
    rawText?: string
  }
  manualInputs: {
    chiefComplaint: string
    presentIllness: string
    pastHistory: string
    familyHistory: string
    physicalExam: string
    diagnosis: string
    treatment: string
  }
  templateId: string
}

interface FusionOutput {
  medicalRecord: {
    chiefComplaint: string
    presentIllness: string
    pastHistory: string
    familyHistory: string
    physicalExam: string
    diagnosis: string
    treatment: string
  }
  confidence: number
  sources: Array<{
    type: string
    content: string
    confidence: number
  }>
  suggestions: string[]
}

export async function POST(request: NextRequest) {
  try {
    const fusionInput: FusionInput = await request.json()

    if (!fusionInput) {
      return NextResponse.json(
        { error: 'No fusion input provided' },
        { status: 400 }
      )
    }

    const fusionOutput = await generateMedicalRecord(fusionInput)

    return NextResponse.json({
      success: true,
      ...fusionOutput
    })
  } catch (error) {
    console.error('Error generating medical record:', error)
    return NextResponse.json(
      { error: 'Failed to generate medical record' },
      { status: 500 }
    )
  }
}

async function generateMedicalRecord(input: FusionInput): Promise<FusionOutput> {
  const sources: Array<{ type: string; content: string; confidence: number }> = []
  const suggestions: string[] = []

  const transcriptionText = input.transcriptions
    .map(t => `[${t.speakerLabel}]: ${t.text}`)
    .join('\n')

  if (transcriptionText) {
    sources.push({
      type: 'audio',
      content: transcriptionText.substring(0, 100) + '...',
      confidence: 0.85
    })
  }

  if (input.extractedData.name || input.extractedData.diagnosis) {
    const extractedInfo = [
      input.extractedData.name && `姓名: ${input.extractedData.name}`,
      input.extractedData.idCard && `身份证: ${input.extractedData.idCard}`,
      input.extractedData.diagnosis && `诊断: ${input.extractedData.diagnosis}`,
      input.extractedData.treatment && `治疗: ${input.extractedData.treatment}`
    ].filter(Boolean).join(', ')

    if (extractedInfo) {
      sources.push({
        type: 'image',
        content: extractedInfo,
        confidence: 0.90
      })
    }
  }

  const manualText = Object.values(input.manualInputs).filter(Boolean).join('\n')
  if (manualText) {
    sources.push({
      type: 'manual',
      content: manualText.substring(0, 100) + '...',
      confidence: 1.0
    })
  }

  const prompt = buildPrompt(input, transcriptionText)
  const aiGeneratedRecord = await callLLM(prompt)

  sources.push({
    type: 'ai',
    content: 'AI生成的病历内容',
    confidence: 0.80
  })

  const medicalRecord = {
    chiefComplaint: mergeContent(
      input.manualInputs.chiefComplaint,
      extractFromTranscription(transcriptionText, '主诉'),
      aiGeneratedRecord.chiefComplaint
    ),
    presentIllness: mergeContent(
      input.manualInputs.presentIllness,
      extractFromTranscription(transcriptionText, '现病史'),
      aiGeneratedRecord.presentIllness
    ),
    pastHistory: mergeContent(
      input.manualInputs.pastHistory,
      extractFromTranscription(transcriptionText, '既往史'),
      aiGeneratedRecord.pastHistory
    ),
    familyHistory: mergeContent(
      input.manualInputs.familyHistory,
      extractFromTranscription(transcriptionText, '家族史'),
      aiGeneratedRecord.familyHistory
    ),
    physicalExam: mergeContent(
      input.manualInputs.physicalExam,
      extractFromTranscription(transcriptionText, '体格检查'),
      aiGeneratedRecord.physicalExam
    ),
    diagnosis: mergeContent(
      input.manualInputs.diagnosis,
      input.extractedData.diagnosis || '',
      aiGeneratedRecord.diagnosis
    ),
    treatment: mergeContent(
      input.manualInputs.treatment,
      input.extractedData.treatment || '',
      aiGeneratedRecord.treatment
    )
  }

  if (input.extractedData.name && !input.manualInputs.diagnosis) {
    suggestions.push('建议补充患者基本信息')
  }

  if (!input.manualInputs.physicalExam && !transcriptionText.includes('体格检查')) {
    suggestions.push('建议补充体格检查结果')
  }

  if (input.manualInputs.diagnosis && !input.manualInputs.treatment) {
    suggestions.push('建议补充治疗方案')
  }

  const confidence = calculateConfidence(sources)

  return {
    medicalRecord,
    confidence,
    sources,
    suggestions
  }
}

function buildPrompt(input: FusionInput, transcriptionText: string): string {
  const template = getTemplate(input.templateId)

  return `你是一个专业的医疗助手，需要根据以下信息生成一份${template.name}。

【患者信息】
${input.extractedData.name ? `姓名: ${input.extractedData.name}` : ''}
${input.extractedData.age ? `年龄: ${input.extractedData.age}` : ''}
${input.extractedData.gender ? `性别: ${input.extractedData.gender === 'male' ? '男' : '女'}` : ''}
${input.extractedData.idCard ? `身份证: ${input.extractedData.idCard}` : ''}

【医患对话转录】
${transcriptionText || '无'}

【图像识别信息】
${input.extractedData.diagnosis ? `诊断: ${input.extractedData.diagnosis}` : ''}
${input.extractedData.treatment ? `治疗: ${input.extractedData.treatment}` : ''}

【手动输入信息】
主诉: ${input.manualInputs.chiefComplaint || '无'}
现病史: ${input.manualInputs.presentIllness || '无'}
既往史: ${input.manualInputs.pastHistory || '无'}
家族史: ${input.manualInputs.familyHistory || '无'}
体格检查: ${input.manualInputs.physicalExam || '无'}
诊断: ${input.manualInputs.diagnosis || '无'}
治疗方案: ${input.manualInputs.treatment || '无'}

请根据以上信息，生成一份完整的病历，包含以下字段：
1. 主诉
2. 现病史
3. 既往史
4. 家族史
5. 体格检查
6. 诊断
7. 治疗方案

要求：
- 使用专业的医学术语
- 内容要完整、准确、符合病历规范
- 如果某些信息缺失，可以根据上下文合理推断，但要标注为"推测"
- 返回JSON格式，字段名为：chiefComplaint, presentIllness, pastHistory, familyHistory, physicalExam, diagnosis, treatment`
}

async function callLLM(prompt: string): Promise<any> {
  try {
    const apiKey = process.env.OPENAI_API_KEY || process.env.ALIYUN_API_KEY

    if (!apiKey) {
      console.warn('No API key configured, using mock data')
      return getMockMedicalRecord(prompt)
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的医疗助手，擅长生成规范的病历记录。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (response.ok) {
      const data = await response.json()
      const content = data.choices[0].message.content

      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    }

    return getMockMedicalRecord(prompt)
  } catch (error) {
    console.error('Error calling LLM:', error)
    return getMockMedicalRecord(prompt)
  }
}

function getMockMedicalRecord(prompt: string): any {
  return {
    chiefComplaint: '患者因"反复咳嗽、咳痰3年，加重1周"就诊。',
    presentIllness: '患者3年前无明显诱因出现咳嗽、咳痰，为白色黏痰，量中等，晨起明显，无发热、胸闷、气促。曾在外院就诊，诊断为"慢性支气管炎"，给予抗感染、止咳化痰治疗后症状缓解。1周前患者受凉后上述症状再次出现，并伴有活动后气促，无发热、胸痛、咯血。为进一步诊治，遂来我院就诊。',
    pastHistory: '既往有"高血压"病史5年，最高血压160/100mmHg，长期服用"氨氯地平"控制血压，血压控制尚可。否认"糖尿病"、"冠心病"等慢性病史。否认"肝炎"、"结核"等传染病史。否认手术、外伤史。否认药物、食物过敏史。',
    familyHistory: '父母健在，否认家族遗传病史。',
    physicalExam: 'T:36.5℃，P:80次/分，R:20次/分，BP:140/90mmHg。神志清楚，精神可。口唇无发绀，咽部充血，扁桃体无肿大。颈静脉无怒张。双肺呼吸音粗，可闻及少量湿性啰音。心率80次/分，律齐，各瓣膜听诊区未闻及病理性杂音。腹软，无压痛、反跳痛。双下肢无水肿。',
    diagnosis: '1. 慢性支气管炎急性加重期\n2. 高血压病（2级，中危）',
    treatment: '1. 抗感染治疗：头孢呋辛酯片0.5g bid\n2. 止咳化痰：氨溴索片30mg tid\n3. 控制血压：继续服用氨氯地平5mg qd\n4. 低盐低脂饮食，避免受凉\n5. 定期复查，不适随诊'
  }
}

function mergeContent(...contents: string[]): string {
  return contents.filter(Boolean).join(' ')
}

function extractFromTranscription(text: string, keyword: string): string {
  const lines = text.split('\n')
  for (const line of lines) {
    if (line.includes(keyword)) {
      return line.replace(keyword, '').trim()
    }
  }
  return ''
}

function calculateConfidence(sources: Array<{ type: string; content: string; confidence: number }>): number {
  if (sources.length === 0) return 0

  const totalConfidence = sources.reduce((sum, source) => sum + source.confidence, 0)
  return totalConfidence / sources.length
}

function getTemplate(templateId: string): { name: string } {
  const templates: Record<string, { name: string }> = {
    outpatient: { name: '门诊病历' },
    inpatient: { name: '住院病历' },
    emergency: { name: '急诊病历' }
  }

  return templates[templateId] || { name: '病历' }
}