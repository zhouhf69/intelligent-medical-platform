import { NextRequest, NextResponse } from 'next/server'

interface DiagnosisSuggestion {
  diagnosis: string
  confidence: number
  icd10: string
  description: string
  recommendedTests: string[]
  treatmentOptions: string[]
  riskFactors: string[]
  followUp: string
}

interface MedicalData {
  chiefComplaint: string
  presentIllness: string
  physicalExam: string
  age: number
  gender: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const medicalData: MedicalData = body

    const suggestions = await generateDiagnosisSuggestions(medicalData)

    return NextResponse.json({
      success: true,
      suggestions,
      note: '当前使用模拟诊断建议。生产环境需要集成真实的AI诊断服务（如IBM Watson Health、Google Healthcare API等）。'
    })
  } catch (error) {
    console.error('Error generating diagnosis suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to generate diagnosis suggestions' },
      { status: 500 }
    )
  }
}

async function generateDiagnosisSuggestions(data: MedicalData): Promise<DiagnosisSuggestion[]> {
  const { chiefComplaint, presentIllness, physicalExam, age, gender } = data

  const keywords = extractKeywords(chiefComplaint + ' ' + presentIllness + ' ' + physicalExam)

  const suggestions: DiagnosisSuggestion[] = []

  if (keywords.includes('咳嗽') || keywords.includes('咳痰')) {
    suggestions.push({
      diagnosis: '急性支气管炎',
      confidence: 0.85,
      icd10: 'J20',
      description: '支气管的急性炎症，通常由病毒或细菌感染引起',
      recommendedTests: [
        '血常规检查',
        '胸部X线检查',
        '痰培养',
        'C反应蛋白检测'
      ],
      treatmentOptions: [
        '抗生素治疗（如细菌感染）',
        '止咳化痰药物',
        '充分休息和补水',
        '避免刺激性物质'
      ],
      riskFactors: [
        '吸烟',
        '空气污染',
        '免疫力低下',
        '慢性呼吸系统疾病'
      ],
      followUp: '3-5天后复查，如症状加重或持续超过1周，建议复诊'
    })

    if (keywords.includes('气促') || keywords.includes('呼吸困难')) {
      suggestions.push({
        diagnosis: '慢性阻塞性肺疾病（COPD）',
        confidence: 0.72,
        icd10: 'J44',
        description: '慢性进行性气流受限的肺部疾病',
        recommendedTests: [
          '肺功能检查',
          '胸部CT',
          '血气分析',
          '6分钟步行试验'
        ],
        treatmentOptions: [
          '支气管扩张剂',
          '吸入性糖皮质激素',
          '氧疗（如需要）',
          '肺康复训练'
        ],
        riskFactors: [
          '长期吸烟',
          '职业性粉尘暴露',
          '空气污染',
          '遗传因素'
        ],
        followUp: '每3-6个月定期随访，监测肺功能变化'
      })
    }
  }

  if (keywords.includes('胸痛') || keywords.includes('胸闷')) {
    suggestions.push({
      diagnosis: '心绞痛',
      confidence: 0.78,
      icd10: 'I20',
      description: '冠状动脉供血不足引起的胸痛',
      recommendedTests: [
        '心电图',
        '心脏超声',
        '心肌酶谱',
        '冠脉造影（如需要）'
      ],
      treatmentOptions: [
        '硝酸酯类药物',
        '抗血小板药物',
        'β受体阻滞剂',
        '他汀类药物'
      ],
      riskFactors: [
        '高血压',
        '高血脂',
        '糖尿病',
        '吸烟',
        '肥胖'
      ],
      followUp: '症状控制后1个月复查，定期监测心脏功能'
    })

    if (keywords.includes('心悸') || keywords.includes('心律不齐')) {
      suggestions.push({
        diagnosis: '心律失常',
        confidence: 0.75,
        icd10: 'I49',
        description: '心脏节律异常',
        recommendedTests: [
          '24小时动态心电图',
          '心脏电生理检查',
          '甲状腺功能检查',
          '电解质检查'
        ],
        treatmentOptions: [
          '抗心律失常药物',
          '射频消融术（如需要）',
          '起搏器植入（如需要）',
          '生活方式调整'
        ],
        riskFactors: [
          '心脏病史',
          '电解质紊乱',
          '甲状腺功能异常',
          '药物影响'
        ],
        followUp: '根据病情严重程度，1-3个月复查'
      })
    }
  }

  if (keywords.includes('头晕') || keywords.includes('头痛')) {
    suggestions.push({
      diagnosis: '原发性高血压',
      confidence: 0.80,
      icd10: 'I10',
      description: '原因不明的慢性高血压',
      recommendedTests: [
        '血压监测',
        '心电图',
        '肾功能检查',
        '眼底检查'
      ],
      treatmentOptions: [
        '钙通道阻滞剂',
        'ACE抑制剂',
        '利尿剂',
        'β受体阻滞剂'
      ],
      riskFactors: [
        '年龄',
        '遗传因素',
        '高盐饮食',
        '缺乏运动',
        '肥胖'
      ],
      followUp: '每2-4周复查，调整治疗方案'
    })

    if (keywords.includes('恶心') || keywords.includes('呕吐')) {
      suggestions.push({
        diagnosis: '偏头痛',
        confidence: 0.68,
        icd10: 'G43',
        description: '反复发作的搏动性头痛',
        recommendedTests: [
          '头颅MRI或CT',
          '脑电图',
          '眼科检查'
        ],
        treatmentOptions: [
          '曲普坦类药物',
          '非甾体抗炎药',
          '预防性药物治疗',
          '生活方式调整'
        ],
        riskFactors: [
          '遗传因素',
          '压力',
          '睡眠不足',
          '某些食物'
        ],
        followUp: '发作频率增加或症状变化时及时复诊'
      })
    }
  }

  if (keywords.includes('腹痛') || keywords.includes('腹胀')) {
    suggestions.push({
      diagnosis: '功能性消化不良',
      confidence: 0.73,
      icd10: 'K30',
      description: '上腹部不适或疼痛，无器质性病变',
      recommendedTests: [
        '胃镜检查',
        '幽门螺杆菌检测',
        '腹部超声'
      ],
      treatmentOptions: [
        '质子泵抑制剂',
        '促胃动力药',
        '抗幽门螺杆菌治疗',
        '饮食调整'
      ],
      riskFactors: [
        '压力',
        '不良饮食习惯',
        '吸烟饮酒',
        '药物影响'
      ],
      followUp: '2-4周后复查，评估治疗效果'
    })

    if (keywords.includes('恶心') || keywords.includes('呕吐')) {
      suggestions.push({
        diagnosis: '急性胃炎',
        confidence: 0.70,
        icd10: 'K29',
        description: '胃黏膜的急性炎症',
        recommendedTests: [
          '血常规',
          '胃镜检查',
          '大便常规'
        ],
        treatmentOptions: [
          '质子泵抑制剂',
          '胃黏膜保护剂',
          '饮食调整',
          '充分休息'
        ],
        riskFactors: [
          '不洁饮食',
          '药物刺激',
          '应激反应',
          '酒精摄入'
        ],
        followUp: '症状缓解后1周复查'
      })
    }
  }

  if (suggestions.length === 0) {
    suggestions.push({
      diagnosis: '待进一步检查',
      confidence: 0.50,
      icd10: 'R50',
      description: '根据现有信息无法确定具体诊断，建议进一步检查',
      recommendedTests: [
        '全面体格检查',
        '血常规',
        '尿常规',
        '生化检查',
        '影像学检查（根据症状）'
      ],
      treatmentOptions: [
        '对症支持治疗',
        '密切观察病情变化',
        '避免自行用药'
      ],
      riskFactors: [
        '年龄因素',
        '基础疾病',
        '环境因素'
      ],
      followUp: '根据检查结果及时复诊'
    })
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5)
}

function extractKeywords(text: string): string[] {
  const commonKeywords = [
    '咳嗽', '咳痰', '气促', '呼吸困难', '胸痛', '胸闷',
    '心悸', '头晕', '头痛', '恶心', '呕吐', '腹痛',
    '腹胀', '腹泻', '发热', '乏力', '食欲不振',
    '失眠', '焦虑', '抑郁'
  ]

  return commonKeywords.filter(keyword => text.includes(keyword))
}