# 智能病历平台 - 部署指南

## 📋 部署前检查清单

### 代码提交
- ✅ 所有功能已实现
- ✅ 代码已提交到Git
- ✅ 数据库模型已更新
- ✅ API接口已创建

### 功能测试
- ✅ 开发服务器正常运行
- ✅ 核心功能正常
- ✅ 多模态功能正常
- ✅ API接口正常

## 🚀 部署步骤

### 第一步：创建GitHub仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角 "+" 号，选择 "New repository"
3. 仓库名称：`intelligent-medical-platform`
4. 选择 "Public" 或 "Private"
5. 点击 "Create repository"

### 第二步：推送代码到GitHub

在项目目录（`d:\养老市场`）运行以下命令：

```bash
# 重命名分支为main
git branch -M main

# 添加远程仓库（替换为你的GitHub用户名）
git remote add origin https://github.com/你的用户名/intelligent-medical-platform.git

# 推送代码到GitHub
git push -u origin main
```

**示例：**
```bash
# 如果你的GitHub用户名是 zhouhongfeng
git remote add origin https://github.com/zhouhongfeng/intelligent-medical-platform.git
git push -u origin main
```

### 第三步：准备数据库

#### 选项A：Supabase（推荐）

1. 访问 [supabase.com](https://supabase.com)
2. 创建免费账户
3. 点击 "New Project"
4. 填写项目信息：
   - Name: `intelligent-medical-platform`
   - Database Password: 设置强密码
5. 等待数据库创建完成（约1-2分钟）
6. 在项目设置中找到 "Database" 部分
7. 复制 "Connection string"（连接字符串）

**连接字符串格式：**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

#### 选项B：Neon

1. 访问 [neon.tech](https://neon.tech)
2. 创建免费账户
3. 点击 "Create a project"
4. 填写项目信息：
   - Name: `intelligent-medical-platform`
5. 等待数据库创建完成
6. 复制 "Connection string"

**连接字符串格式：**
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

### 第四步：部署到Netlify

1. **登录Netlify**
   - 访问 [Netlify](https://app.netlify.com)
   - 使用GitHub账户登录或注册

2. **导入项目**
   - 点击 "Add new site"
   - 选择 "Import an existing project"
   - 选择 "GitHub"
   - 授权Netlify访问你的GitHub仓库
   - 选择 `intelligent-medical-platform` 仓库

3. **配置构建设置**
   Netlify会自动检测Next.js项目
   - 构建命令：`npm run build`
   - 发布目录：`.next`
   - Node.js版本：`18`

4. **配置环境变量**
   在 "Site settings" > "Environment variables" 中添加：
   
   **必需变量：**
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   NODE_ENV=production
   ```
   
   **可选变量：**
   ```
   OPENAI_API_KEY=your-openai-api-key
   ALIYUN_API_KEY=your-aliyun-api-key
   ```
   
   **重要**：将 `DATABASE_URL` 替换为你从数据库提供商获得的实际连接字符串

5. **部署**
   - 点击 "Deploy site"
   - 等待构建完成（通常需要2-5分钟）
   - 构建成功后，你将获得一个Netlify URL

### 第五步：初始化生产数据库

部署成功后，在本地运行以下命令初始化数据库：

```bash
# 生成Prisma Client
npm run db:generate

# 推送数据库结构到云数据库
npm run db:push
```

或者使用迁移：
```bash
npm run db:migrate
```

## 🔧 环境变量配置

### .env 文件（本地开发）
```env
DATABASE_URL="file:./dev.db"
NODE_ENV=development
```

### Netlify环境变量（生产环境）
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NODE_ENV=production
OPENAI_API_KEY=sk-...
ALIYUN_API_KEY=...
```

## 📊 功能说明

### 已实现功能

#### 核心功能
- ✅ 患者信息管理
- ✅ 病历创建和编辑
- ✅ 语音输入（Web Speech API）
- ✅ 数据导出（JSON/CSV）
- ✅ 统计分析
- ✅ 打印功能

#### 多模态输入
- ✅ 语音录音和转文字（模拟数据）
- ✅ OCR图像识别（模拟数据）
- ✅ 身份证识别
- ✅ 病历资料识别

#### 智能融合
- ✅ 多模态融合引擎
- ✅ LLM集成（OpenAI GPT-4）
- ✅ 病历模版系统
- ✅ 智能病历生成
- ✅ 数据源追踪

### 模拟数据说明

当前版本使用模拟数据进行演示：

#### 语音转录
- 返回预定义的医疗场景文本
- 包含主诉、现病史等信息

#### OCR识别
- 身份证识别：返回模拟的身份证信息
- 病历资料识别：返回模拟的诊断和治疗信息

#### LLM融合
- 在没有API密钥时使用模拟数据
- 配置API密钥后使用真实的OpenAI服务

### 升级到真实服务

#### 语音识别
推荐服务：
- **Azure Speech Service**：支持说话人分离
- **阿里云语音识别**：国内访问快
- **百度语音识别**：准确率高

#### OCR识别
推荐服务：
- **百度OCR API**：身份证识别准确率高
- **腾讯云OCR**：支持多种文档
- **Google Vision API**：功能强大

#### LLM服务
推荐服务：
- **OpenAI GPT-4**：最强能力
- **阿里通义千问**：国内访问快
- **百度文心一言**：中文优化

## 🧪 测试清单

部署后，请测试以下功能：

### 基础功能
- [ ] 访问首页
- [ ] 创建患者
- [ ] 创建病历
- [ ] 查看患者列表
- [ ] 查看病历详情
- [ ] 编辑病历
- [ ] 删除病历

### 多模态功能
- [ ] 访问录音页面
- [ ] 录制音频
- [ ] 播放录音
- [ ] 转换为文字
- [ ] 访问OCR页面
- [ ] 上传图片
- [ ] 识别图片内容
- [ ] 访问融合页面
- [ ] 选择患者和模版
- [ ] 融合生成病历
- [ ] 查看融合结果

### 模版功能
- [ ] 访问模版管理
- [ ] 创建新模版
- [ ] 编辑模版
- [ ] 删除模版
- [ ] 使用模版创建病历

### 数据功能
- [ ] 导出患者数据
- [ ] 导出病历数据
- [ ] 查看统计数据
- [ ] 打印病历

## 🔍 故障排除

### 构建失败

**问题**：Netlify构建失败

**解决方案**：
1. 检查构建日志中的错误信息
2. 确认 `DATABASE_URL` 环境变量已正确设置
3. 确认所有依赖都已安装
4. 检查Node.js版本是否设置为18

### 数据库连接失败

**问题**：无法连接到数据库

**解决方案**：
1. 确认 `DATABASE_URL` 格式正确
2. 检查数据库是否正在运行
3. 确认数据库用户有足够的权限
4. 检查防火墙设置

### API错误

**问题**：API调用失败

**解决方案**：
1. 检查API密钥是否正确
2. 确认API服务是否正常运行
3. 检查网络连接
4. 查看浏览器控制台错误信息

## 💰 成本估算

### Netlify
- **免费套餐**：足够个人使用
  - 100GB 带宽/月
  - 300 分钟构建时间/月
  - 无限站点

### 数据库
- **Supabase免费套餐**：
  - 500MB 数据库存储
  - 1GB 文件存储
  - 2GB 带宽/月

- **Neon免费套餐**：
  - 0.5GB 数据库存储
  - 无限项目
  - 自动休眠

### API服务（可选）
- **Azure Speech**：$1/小时（说话人分离）
- **百度OCR**：¥0.001/次（身份证识别）
- **OpenAI GPT-4**：$0.03/1K tokens

**预估月成本（1000次使用）**：
- 语音识别：$100
- OCR识别：¥10
- LLM调用：$30
- **总计**：约$150/月

## 📞 技术支持

### 开发者信息
- **开发者**：周宏锋
- **电话**：13609737049
- **邮箱**：13609737049@139.com

### 文档链接
- [README.md](./README.md) - 项目说明
- [MULTIMODAL_DESIGN.md](./MULTIMODAL_DESIGN.md) - 多模态设计
- [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) - GitHub部署指南
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署文档

## 🎉 部署完成

恭喜！智能病历平台已成功部署。

### 下一步
1. 访问Netlify提供的URL
2. 测试所有功能
3. 根据需要配置API密钥
4. 根据需要升级到真实服务
5. 收集用户反馈并持续优化

### 维护建议
- 定期备份数据库
- 监控API使用量和成本
- 及时更新依赖包
- 关注安全漏洞公告
- 收集用户反馈并改进功能

---

**祝您使用愉快！** 🎊