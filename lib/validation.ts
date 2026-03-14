export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validatePatient(data: {
  name?: string
  age?: string | number
  gender?: string
  phone?: string
  idCard?: string
  admissionDate?: string
}): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.name || data.name.trim() === '') {
    errors.name = '姓名不能为空'
  } else if (data.name.length < 2) {
    errors.name = '姓名至少需要2个字符'
  } else if (data.name.length > 50) {
    errors.name = '姓名不能超过50个字符'
  }

  if (!data.age) {
    errors.age = '年龄不能为空'
  } else {
    const age = typeof data.age === 'string' ? parseInt(data.age) : data.age
    if (isNaN(age) || age < 0 || age > 150) {
      errors.age = '年龄必须在0-150之间'
    }
  }

  if (!data.gender) {
    errors.gender = '请选择性别'
  } else if (!['male', 'female'].includes(data.gender)) {
    errors.gender = '性别选择无效'
  }

  if (!data.phone || data.phone.trim() === '') {
    errors.phone = '联系电话不能为空'
  } else if (!/^1[3-9]\d{9}$/.test(data.phone)) {
    errors.phone = '请输入有效的手机号码'
  }

  if (data.idCard && data.idCard.trim() !== '') {
    if (!/^\d{17}[\dXx]$/.test(data.idCard)) {
      errors.idCard = '请输入有效的身份证号码'
    } else if (!validateIdCard(data.idCard)) {
      errors.idCard = '身份证号码校验失败'
    }
  }

  if (!data.admissionDate) {
    errors.admissionDate = '入院日期不能为空'
  } else {
    const admissionDate = new Date(data.admissionDate)
    const today = new Date()
    if (isNaN(admissionDate.getTime())) {
      errors.admissionDate = '入院日期格式无效'
    } else if (admissionDate > today) {
      errors.admissionDate = '入院日期不能晚于今天'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateMedicalRecord(data: {
  chiefComplaint?: string
  presentIllness?: string
  physicalExam?: string
  diagnosis?: string
  treatment?: string
}): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.chiefComplaint || data.chiefComplaint.trim() === '') {
    errors.chiefComplaint = '主诉不能为空'
  } else if (data.chiefComplaint.length > 500) {
    errors.chiefComplaint = '主诉不能超过500个字符'
  }

  if (!data.presentIllness || data.presentIllness.trim() === '') {
    errors.presentIllness = '现病史不能为空'
  } else if (data.presentIllness.length > 2000) {
    errors.presentIllness = '现病史不能超过2000个字符'
  }

  if (data.pastHistory && data.pastHistory.length > 2000) {
    errors.pastHistory = '既往史不能超过2000个字符'
  }

  if (data.familyHistory && data.familyHistory.length > 2000) {
    errors.familyHistory = '家族史不能超过2000个字符'
  }

  if (!data.physicalExam || data.physicalExam.trim() === '') {
    errors.physicalExam = '体格检查不能为空'
  } else if (data.physicalExam.length > 2000) {
    errors.physicalExam = '体格检查不能超过2000个字符'
  }

  if (!data.diagnosis || data.diagnosis.trim() === '') {
    errors.diagnosis = '初步诊断不能为空'
  } else if (data.diagnosis.length > 500) {
    errors.diagnosis = '初步诊断不能超过500个字符'
  }

  if (!data.treatment || data.treatment.trim() === '') {
    errors.treatment = '诊疗计划不能为空'
  } else if (data.treatment.length > 2000) {
    errors.treatment = '诊疗计划不能超过2000个字符'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

function validateIdCard(idCard: string): boolean {
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const codes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard[i]) * weights[i]
  }
  
  const mod = sum % 11
  const lastCode = codes[mod]
  
  return idCard[17].toUpperCase() === lastCode
}

export function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}