async function testMultimodalAPI() {
  console.log('开始测试多模态API...\n');

  // 测试语音转录API
  console.log('1. 测试语音转录API...');
  try {
    const audioResponse = await fetch('http://localhost:3002/api/audio/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: 'test-audio.wav'
      })
    });
    
    if (audioResponse.ok) {
      const audioData = await audioResponse.json();
      console.log('✅ 语音转录API成功');
      console.log('   转录文本:', audioData.text.substring(0, 50) + '...');
      console.log('   置信度:', audioData.confidence);
    } else {
      console.log('❌ 语音转录API失败');
    }
  } catch (error) {
    console.log('❌ 语音转录API测试失败:', error.message);
  }
  
  // 测试OCR识别API
  console.log('\n2. 测试OCR识别API...');
  try {
    const ocrResponse = await fetch('http://localhost:3002/api/ocr/recognize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: 'test-image.jpg',
        type: 'id_card'
      })
    });
    
    if (ocrResponse.ok) {
      const ocrData = await ocrResponse.json();
      console.log('✅ OCR识别API成功');
      console.log('   识别结果:', JSON.stringify(ocrData.extractedData, null, 2).substring(0, 100) + '...');
    } else {
      console.log('❌ OCR识别API失败');
    }
  } catch (error) {
    console.log('❌ OCR识别API测试失败:', error.message);
  }
  
  // 测试融合生成API
  console.log('\n3. 测试融合生成API...');
  try {
    const fusionResponse = await fetch('http://localhost:3002/api/fusion/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcriptions: [
          {
            speakerLabel: '医生',
            text: '患者主诉反复咳嗽、咳痰3年，加重1周'
          }
        ],
        extractedData: {
          name: '张三',
          age: 45,
          gender: 'male'
        },
        manualInputs: {
          diagnosis: '慢性支气管炎急性发作'
        },
        templateId: 'default'
      })
    });
    
    if (fusionResponse.ok) {
      const fusionData = await fusionResponse.json();
      console.log('✅ 融合生成API成功');
      console.log('   置信度:', fusionData.confidence);
      console.log('   数据源数量:', fusionData.sources.length);
    } else {
      console.log('❌ 融合生成API失败');
    }
  } catch (error) {
    console.log('❌ 融合生成API测试失败:', error.message);
  }
  
  console.log('\n多模态API测试完成！');
}

testMultimodalAPI();