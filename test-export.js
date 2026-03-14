async function testExportAPI() {
  console.log('开始测试数据导出API...\n');

  // 测试导出患者数据（JSON格式）
  console.log('1. 测试导出患者数据（JSON格式）...');
  try {
    const exportResponse = await fetch('http://localhost:3002/api/export?type=patients&format=json');
    
    if (exportResponse.ok) {
      const exportData = await exportResponse.json();
      console.log('✅ 导出患者数据成功');
      console.log('   患者数量:', exportData.patients.length);
    } else {
      console.log('❌ 导出患者数据失败');
    }
  } catch (error) {
    console.log('❌ 导出患者数据测试失败:', error.message);
  }
  
  // 测试导出病历数据（CSV格式）
  console.log('\n2. 测试导出病历数据（CSV格式）...');
  try {
    const exportResponse = await fetch('http://localhost:3002/api/export?type=records&format=csv');
    
    if (exportResponse.ok) {
      const csvData = await exportResponse.text();
      console.log('✅ 导出病历数据成功');
      console.log('   CSV内容前100字符:', csvData.substring(0, 100) + '...');
    } else {
      console.log('❌ 导出病历数据失败');
    }
  } catch (error) {
    console.log('❌ 导出病历数据测试失败:', error.message);
  }
  
  console.log('\n数据导出API测试完成！');
}

testExportAPI();