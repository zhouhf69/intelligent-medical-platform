import { NextRequest, NextResponse } from 'next/server'

interface QualityScore {
  totalScore: number
  maxScore: number
  percentage: number
  grade: string
  details: {
    category: string
    score: number
    maxScore: number
    issues: string[]
    suggestions: string[]
  }[]
}

interface MedicalRecordData {
  chiefComplaint: string
  presentIllness: string
  pastHistory?: string
  familyHistory?: string
  physicalExam: string
  diagnosis: string
  treatment: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const medicalData: MedicalRecordData = body

    const qualityScore = calculateQualityScore(medicalData)

    return NextResponse.json({
      success: true,
      qualityScore,
      note: '当前使用模拟质量评分。生产环境可以使用NLP技术进行更精确的评估。'
    })
  } catch (error) {
    console.error('Error calculating quality score:', error)
    return NextResponse.json(
      { error: 'Failed to calculate quality score' },
      { status: 500 }
    )
  }
}

function calculateQualityScore(data: MedicalRecordData): QualityScore {
  const details: QualityScore['details'] = []

  details.push(evaluateChiefComplaint(data.chiefComplaint))
  details.push(evaluatePresentIllness(data.presentIllness))
  details.push(evaluatePastHistory(data.pastHistory))
  details.push(evaluateFamilyHistory(data.familyHistory))
  details.push(evaluatePhysicalExam(data.physicalExam))
  details.push(evaluateDiagnosis(data.diagnosis))
  details.push(evaluateTreatment(data.treatment))

  const totalScore = details.reduce((sum, d) => sum + d.score, 0)
  const maxScore = details.reduce((sum, d) => sum + d.maxScore, 0)
  const percentage = Math.round((totalScore / maxScore) * 100)

  let grade = 'C'
  if (percentage >= 90) grade = 'A'
  else if (percentage >= 80) grade = 'B'
  else if (percentage >= 70) grade = 'C'
  else grade = 'D'

  return {
    totalScore,
    maxScore,
    percentage,
    grade,
    details
  }
}

function evaluateChiefComplaint(chiefComplaint: string): QualityScore['details'][0] {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 10
  const maxScore = 10

  if (!chiefComplaint || chiefComplaint.length < 5) {
    score = 0
    issues.push('主诉内容过短或为空')
    suggestions.push('请详细描述患者的主要症状')
  } else if (chiefComplaint.length < 20) {
    score = 5
    issues.push('主诉描述不够详细')
    suggestions.push('建议补充症状的持续时间、严重程度等信息')
  }

  const requiredElements = ['症状', '时间', '部位']
  const missingElements = requiredElements.filter(el => !chiefComplaint.includes(el))
  if (missingElements.length > 0) {
    score = Math.max(0, score - 3)
    issues.push(`缺少关键信息：${missingElements.join('、')}`)
    suggestions.push('主诉应包含症状、持续时间、部位等关键信息')
  }

  return { category: '主诉', score, maxScore, issues, suggestions }
}

function evaluatePresentIllness(presentIllness: string): QualityScore['details'][0] {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 20
  const maxScore = 20

  if (!presentIllness || presentIllness.length < 20) {
    score = 0
    issues.push('现病史内容过短或为空')
    suggestions.push('请详细描述疾病的起病、发展过程')
  } else if (presentIllness.length < 50) {
    score = 10
    issues.push('现病史描述不够详细')
    suggestions.push('建议补充起病诱因、症状演变、诊治经过等')
  }

  const requiredElements = ['起病', '发展', '诊治']
  const missingElements = requiredElements.filter(el => !presentIllness.includes(el))
  if (missingElements.length > 0) {
    score = Math.max(0, score - 5)
    issues.push(`缺少关键信息：${missingElements.join('、')}`)
    suggestions.push('现病史应包含起病、发展、诊治经过等关键信息')
  }

  return { category: '现病史', score, maxScore, issues, suggestions }
}

function evaluatePastHistory(pastHistory?: string): QualityScore['details'][0] {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 10
  const maxScore = 10

  if (!pastHistory) {
    score = 5
    issues.push('既往史未填写')
    suggestions.push('建议补充既往病史信息')
  } else if (pastHistory.length < 10) {
    score = 3
    issues.push('既往史描述过于简单')
    suggestions.push('建议详细描述既往疾病史、手术史、过敏史等')
  }

  return { category: '既往史', score, maxScore, issues, suggestions }
}

function evaluateFamilyHistory(familyHistory?: string): QualityScore['details'][0] {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 10
  const maxScore = 10

  if (!familyHistory) {
    score = 5
    issues.push('家族史未填写')
    suggestions.push('建议补充家族病史信息')
  } else if (familyHistory.length < 10) {
    score = 3
    issues.push('家族史描述过于简单')
    suggestions.push('建议详细描述家族遗传病史、重大疾病史等')
  }

  return { category: '家族史', score, maxScore, issues, suggestions }
}

function evaluatePhysicalExam(physicalExam: string): QualityScore['details'][0] {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 20
  const maxScore = 20

  if (!physicalExam || physicalExam.length < 20) {
    score = 0
    issues.push('体格检查内容过短或为空')
    suggestions.push('请详细记录体格检查结果')
  } else if (physicalExam.length < 50) {
    score = 10
    issues.push('体格检查描述不够详细')
    suggestions.push('建议补充生命体征、各系统检查结果')
  }

  const requiredElements = ['体温', '血压', '心率']
  const missingElements = requiredElements.filter(el => !physicalExam.includes(el))
  if (missingElements.length > 0) {
    score = Math.max(0, score - 5)
    issues.push(`缺少关键生命体征：${missingElements.join('、')}`)
    suggestions.push('体格检查应包含体温、血压、心率等生命体征')
  }

  return { category: '体格检查', score, maxScore, issues, suggestions }
}

function evaluateDiagnosis(diagnosis: string): QualityScore['details'][0] {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 15
  const maxScore = 15

  if (!diagnosis || diagnosis.length < 5) {
    score = 0
    issues.push('诊断内容过短或为空')
    suggestions.push('请明确诊断结果')
  } else if (diagnosis.length < 10) {
    score = 7
    issues.push('诊断描述不够明确')
    suggestions.push('建议补充诊断的具体类型、分期等信息')
  }

  if (!diagnosis.includes('病') && !diagnosis.includes('症') && !diagnosis.includes('炎')) {
    score = Math.max(0, score - 3)
    issues.push('诊断表述不规范')
    suggestions.push('诊断应使用规范的医学术语')
  }

  return { category: '诊断', score, maxScore, issues, suggestions }
}

function evaluateTreatment(treatment: string): QualityScore['details'][0] {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 15
  const maxScore = 15

  if (!treatment || treatment.length < 10) {
    score = 0
    issues.push('治疗方案内容过短或为空')
    suggestions.push('请详细记录治疗方案')
  } else if (treatment.length < 30) {
    score = 7
    issues.push('治疗方案描述不够详细')
    suggestions.push('建议补充药物名称、剂量、用法、疗程等信息')
  }

  const requiredElements = ['治疗', '药物']
  const missingElements = requiredElements.filter(el => !treatment.includes(el))
  if (missingElements.length > 0) {
    score = Math.max(0, score - 5)
    issues.push(`缺少关键信息：${missingElements.join('、')}`)
    suggestions.push('治疗方案应包含药物、用法、疗程等关键信息')
  }

  return { category: '治疗', score, maxScore, issues, suggestions }
}