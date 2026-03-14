async function testAPI() {
  console.log('开始测试API...\n');

  // 测试创建患者
  console.log('1. 测试创建患者...');
  try {
    const patientResponse = await fetch('http://localhost:3002/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '测试患者',
        age: 45,
        gender: 'male',
        idCard: '110101198001011234',
        phone: '13800138000',
        admissionDate: '2026-03-14'
      })
    });
    
    if (patientResponse.ok) {
      const patient = await patientResponse.json();
      console.log('✅ 患者创建成功:', patient.name);
      console.log('   患者ID:', patient.id);
      
      // 测试获取患者列表
      console.log('\n2. 测试获取患者列表...');
      const listResponse = await fetch('http://localhost:3002/api/patients');
      if (listResponse.ok) {
        const data = await listResponse.json();
        console.log('✅ 获取患者列表成功');
        console.log('   总数:', data.pagination.total);
        console.log('   当前页:', data.pagination.page);
      } else {
        console.log('❌ 获取患者列表失败');
      }
      
      // 测试创建病历
      console.log('\n3. 测试创建病历...');
      const recordResponse = await fetch('http://localhost:3002/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patient.id,
          chiefComplaint: '反复咳嗽、咳痰3年，加重1周',
          presentIllness: '患者3年前无明显诱因出现咳嗽、咳痰，为白色黏痰，量中等，晨起明显，无发热、胸闷、气促。曾在外院就诊，诊断为慢性支气管炎，给予抗感染、止咳化痰治疗后症状缓解。1周前患者受凉后上述症状再次出现，并伴有活动后气促，无发热、胸痛、咯血。',
          pastHistory: '否认高血压、糖尿病、冠心病病史。否认手术外伤史。否认药物过敏史。',
          familyHistory: '父母健在，否认家族遗传病史。',
          physicalExam: 'T 36.5℃，P 80次/分，R 20次/分，BP 120/80mmHg。神志清楚，精神可，口唇无发绀。双肺呼吸音粗，可闻及少量湿啰音。心律齐，各瓣膜听诊区未闻及病理性杂音。腹平软，无压痛及反跳痛。双下肢无水肿。',
          diagnosis: '慢性支气管炎急性发作',
          treatment: '1. 抗感染治疗：头孢呋辛酯片 0.5g bid\n2. 止咳化痰：氨溴索片 30mg tid\n3. 对症支持治疗'
        })
      });
      
      if (recordResponse.ok) {
        const record = await recordResponse.json();
        console.log('✅ 病历创建成功');
        console.log('   病历ID:', record.id);
        console.log('   诊断:', record.diagnosis);
      } else {
        console.log('❌ 病历创建失败');
      }
      
    } else {
      console.log('❌ 患者创建失败');
    }
  } catch (error) {
    console.log('❌ API测试失败:', error.message);
  }
  
  console.log('\n测试完成！');
}

testAPI();