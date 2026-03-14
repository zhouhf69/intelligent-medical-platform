# 智能病历平台 - 快速部署指南

## 🚀 快速部署步骤

### 方案A：使用GitHub Desktop（推荐）

1. **下载GitHub Desktop**
   - 访问：https://desktop.github.com
   - 下载并安装GitHub Desktop

2. **克隆现有仓库**
   - 打开GitHub Desktop
   - 点击 "File" > "Clone Repository"
   - 输入URL：`https://github.com/zhouhf69/intelligent-medical-platform.git`
   - 选择本地路径：`D:\养老市场`
   - 点击 "Clone"

3. **推送代码**
   - 在GitHub Desktop中查看更改
   - 点击 "Commit to main"
   - 输入提交信息：`Add advanced features and deployment guide`
   - 点击 "Commit"
   - 点击 "Push origin"

### 方案B：使用命令行（需要网络连接）

如果网络连接正常，可以尝试以下命令：

```bash
# 在项目目录中
cd D:\养老市场

# 尝试推送（可能需要重试几次）
git push -u origin main
```

### 方案C：手动上传文件

如果上述方法都不可行，可以手动上传文件：

1. 访问：https://github.com/zhouhf69/intelligent-medical-platform
2. 点击 "Upload files"
3. 将以下文件拖拽上传：
   - 所有源代码文件
   - package.json
   - prisma/schema.prisma
   - 所有配置文件

## 🌐 部署到Netlify

### 步骤1：登录Netlify

1. 访问：https://app.netlify.com
2. 点击 "Sign up" 或使用GitHub账户登录

### 步骤2：导入GitHub仓库

1. 点击 "Add new site"
2. 选择 "Import an existing project"
3. 点击 "GitHub"
4. 授权Netlify访问GitHub
5. 选择 `intelligent-medical-platform` 仓库
6. 点击 "Import site"

### 步骤3：配置构建设置

Netlify会自动检测Next.js项目，配置如下：

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node.js version**: `18`

### 步骤4：配置环境变量

在 "Site settings" > "Environment variables" 中添加：

#### 必需变量
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NODE_ENV=production
```

#### 获取DATABASE_URL

**使用Supabase（推荐）**：
1. 访问：https://supabase.com
2. 创建免费账户
3. 点击 "New Project"
4. 项目名称：`intelligent-medical-platform`
5. 设置数据库密码
6. 等待创建完成（1-2分钟）
7. 在项目设置中找到 "Connection string"
8. 复制连接字符串

**使用Neon**：
1. 访问：https://neon.tech
2. 创建免费账户
3. 点击 "Create a project"
4. 项目名称：`intelligent-medical-platform`
5. 复制连接字符串

#### 可选变量（用于真实AI服务）
```
OPENAI_API_KEY=sk-...
ALIYUN_API_KEY=...
BAIDU_OCR_API_KEY=...
```

### 步骤5：部署

1. 点击 "Deploy site"
2. 等待构建完成（2-5分钟）
3. 构建成功后会获得URL

## 📊 功能验证

部署成功后，访问Netlify提供的URL并测试：

### 基础功能测试
- [ ] 访问首页
- [ ] 创建患者
- [ ] 创建病历
- [ ] 查看患者列表
- [ ] 查看病历详情

### 高级功能测试
- [ ] 访问 `/diagnosis` - 智能诊断
- [ ] 测试质量评分
- [ ] 创建随访计划
- [ ] 查看数据仪表板
- [ ] 发起科室协作

### 多模态功能测试
- [ ] 访问录音页面
- [ ] 访问OCR页面
- [ ] 访问融合页面

## 🔧 常见问题

### 问题1：构建失败

**解决方案**：
1. 检查 `DATABASE_URL` 环境变量是否正确
2. 确认数据库连接字符串格式正确
3. 查看构建日志中的错误信息

### 问题2：数据库连接失败

**解决方案**：
1. 确认数据库正在运行
2. 检查防火墙设置
3. 验证SSL证书

### 问题3：API调用失败

**解决方案**：
1. 检查API密钥是否正确配置
2. 确认API服务是否正常运行
3. 查看浏览器控制台错误信息

## 💡 提示

### 当前使用模拟数据

- **语音转录**：返回预定义的医疗场景文本
- **OCR识别**：返回模拟的身份证和病历信息
- **诊断建议**：基于关键词匹配的模拟诊断
- **LLM融合**：在没有API密钥时使用模拟数据

### 升级到真实服务

配置以下环境变量后，将使用真实服务：

```env
# OpenAI API
OPENAI_API_KEY=sk-...

# 阿里云API
ALIYUN_API_KEY=...

# 百度OCR
BAIDU_OCR_API_KEY=...
```

## 📞 技术支持

**开发者**：周宏锋
**电话**：13609737049
**邮箱**：13609737049@139.com

## 🎉 完成

按照上述步骤完成后，您的智能病历平台将成功部署到Netlify！

### 下一步
1. 访问部署的URL
2. 测试所有功能
3. 根据需要配置API密钥
4. 收集用户反馈
5. 持续优化功能

---

**祝您部署顺利！** 🚀