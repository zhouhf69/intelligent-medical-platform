const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据库...')

  try {
    await prisma.$connect()
    console.log('数据库连接成功')

    const patientCount = await prisma.patient.count()
    console.log(`当前患者数量: ${patientCount}`)

    if (patientCount === 0) {
      console.log('创建示例患者数据...')
      const patient = await prisma.patient.create({
        data: {
          name: '张三',
          age: 45,
          gender: 'male',
          phone: '13800138000',
          admissionDate: new Date(),
          records: {
            create: {
              chiefComplaint: '发热3天',
              presentIllness: '患者3天前无明显诱因出现发热，体温最高38.5℃，伴咳嗽、咽痛',
              pastHistory: '既往体健，无特殊病史',
              familyHistory: '家族中无类似疾病史',
              physicalExam: 'T 38.2℃，P 90次/分，R 20次/分，BP 120/80mmHg。咽部充血，扁桃体I度肿大',
              diagnosis: '急性上呼吸道感染',
              treatment: '1. 休息，多饮水\n2. 退热治疗\n3. 抗感染治疗',
              status: 'completed'
            }
          }
        }
      })
      console.log('示例患者创建成功:', patient.name)
    }

    console.log('数据库初始化完成！')
  } catch (error) {
    console.error('数据库初始化失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()