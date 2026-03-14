import { prisma } from '../prisma/client'

async function main() {
  console.log('开始初始化数据库...')

  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        name: '张三',
        age: 68,
        gender: '男',
        idCard: '110101195601011234',
        phone: '13800138001',
        admissionDate: new Date('2024-01-15'),
      },
    }),
    prisma.patient.create({
      data: {
        name: '李四',
        age: 72,
        gender: '女',
        idCard: '110101195205021234',
        phone: '13800138002',
        admissionDate: new Date('2024-02-20'),
      },
    }),
    prisma.patient.create({
      data: {
        name: '王五',
        age: 65,
        gender: '男',
        idCard: '110101195903031234',
        phone: '13800138003',
        admissionDate: new Date('2024-03-10'),
      },
    }),
  ])

  console.log('患者数据创建成功:', patients.length)

  const records = await Promise.all([
    prisma.medicalRecord.create({
      data: {
        patientId: patients[0].id,
        chiefComplaint: '头痛、头晕3天',
        presentIllness: '患者3天前无明显诱因出现头痛、头晕，呈持续性胀痛，伴恶心、呕吐，无发热，无意识障碍。',
        pastHistory: '高血压病史10年，糖尿病病史5年',
        physicalExam: 'T:36.5℃ P:80次/分 R:18次/分 BP:150/90mmHg 神志清楚，精神可，双肺呼吸音清，心率80次/分，律齐，腹软，无压痛。',
        diagnosis: '高血压病（2级，很高危）',
        treatment: '1. 降压治疗：氨氯地平5mg qd\n2. 控制血糖：二甲双胍0.5g bid\n3. 对症支持治疗',
        doctor: '张医生',
      },
    }),
    prisma.medicalRecord.create({
      data: {
        patientId: patients[1].id,
        chiefComplaint: '胸闷、气短1周',
        presentIllness: '患者1周前无明显诱因出现胸闷、气短，活动后加重，休息后缓解，伴心悸，无胸痛，无呼吸困难。',
        pastHistory: '冠心病病史8年，陈旧性心肌梗死',
        physicalExam: 'T:36.8℃ P:88次/分 R:20次/分 BP:130/80mmHg 神志清楚，精神可，双肺呼吸音粗，未闻及干湿性啰音，心率88次/分，律齐，心尖部可闻及2/6级收缩期杂音。',
        diagnosis: '冠心病、陈旧性心肌梗死、心功能II级',
        treatment: '1. 抗血小板治疗：阿司匹林100mg qd\n2. 降脂治疗：阿托伐他汀20mg qn\n3. 改善心功能：美托洛尔25mg bid',
        doctor: '李医生',
      },
    }),
    prisma.medicalRecord.create({
      data: {
        patientId: patients[2].id,
        chiefComplaint: '咳嗽、咳痰2天',
        presentIllness: '患者2天前受凉后出现咳嗽、咳痰，为白色粘痰，不易咳出，伴咽痛，无发热，无胸痛。',
        pastHistory: '慢性支气管炎病史10年',
        physicalExam: 'T:37.2℃ P:76次/分 R:18次/分 BP:120/70mmHg 神志清楚，精神可，咽部充血，双肺呼吸音粗，可闻及少量干性啰音，心率76次/分，律齐，腹软，无压痛。',
        diagnosis: '急性支气管炎、慢性支气管炎急性发作',
        treatment: '1. 抗感染治疗：左氧氟沙星0.5g qd\n2. 止咳化痰：氨溴索30mg tid\n3. 对症支持治疗',
        doctor: '王医生',
      },
    }),
  ])

  console.log('病历数据创建成功:', records.length)
  console.log('数据库初始化完成！')
}

main()
  .catch((e) => {
    console.error('数据库初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })