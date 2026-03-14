# 多模态智能病历系统设计方案

## 🎯 系统概述

基于现有智能病历平台，升级为支持多模态输入的高级系统，实现语音、图像、文本、文件的智能融合。

## 📋 核心功能

### 1. 多人说话识别（Speaker Diarization）

**功能描述：**
- 每日录音功能
- 自动识别和分离不同说话人
- 语音转文字（ASR）
- 自动标注说话人角色（医生、患者、家属等）

**技术方案：**
- **前端**：Web Speech API + MediaRecorder API
- **后端**：集成第三方AI服务
  - 选项A：Azure Speech Service（支持说话人分离）
  - 选项B：Google Cloud Speech-to-Text
  - 选项C：阿里云语音识别
  - 选项D：本地部署（Pyannote.audio + Whisper）

**实现步骤：**
1. 录音并上传音频文件
2. 后端调用说话人分离API
3. 返回带说话人标签的文字转录
4. 前端展示并允许编辑

**数据结构：**
```typescript
interface AudioRecording {
  id: string
  patientId: string
  recordId: string
  audioUrl: string
  duration: number
  createdAt: Date
  transcriptions: Transcription[]
}

interface Transcription {
  id: string
  speakerId: string
  speakerLabel: string // "医生", "患者", "家属", "其他"
  text: string
  startTime: number
  endTime: number
  confidence: number
}
```

### 2. 图像识别与解析（OCR）

**功能描述：**
- 身份证拍照识别
- 病历资料拍照识别
- 自动提取关键信息
- 匹配病历模版

**技术方案：**
- **前端**：File API + Canvas API
- **后端**：集成OCR服务
  - 选项A：Tesseract.js（前端OCR）
  - 选项B：百度OCR API
  - 选项C：腾讯云OCR
  - 选项D：Google Vision API

**实现步骤：**
1. 拍照或上传图片
2. 前端预览和裁剪
3. 上传到后端
4. 调用OCR API识别文字
5. 提取结构化信息
6. 自动填充到病历表单

**数据结构：**
```typescript
interface ImageDocument {
  id: string
  patientId: string
  recordId: string
  imageUrl: string
  type: 'id_card' | 'medical_record' | 'prescription' | 'other'
  extractedData: ExtractedData
  createdAt: Date
}

interface ExtractedData {
  name?: string
  idCard?: string
  age?: number
  gender?: 'male' | 'female'
  phone?: string
  diagnosis?: string
  treatment?: string
  rawText: string
}
```

### 3. 多模态融合引擎

**功能描述：**
- 智能组合语音、图像、文本、文件
- 匹配病历模版
- 生成符合规范的病历记录

**技术方案：**
- **AI模型**：大语言模型（LLM）
  - 选项A：OpenAI GPT-4
  - 选项B：阿里通义千问
  - 选项C：百度文心一言
  - 选项D：本地部署（Llama 3）

**实现步骤：**
1. 收集所有输入数据（语音转录、OCR结果、手动输入）
2. 构建上下文提示词
3. 调用LLM生成病历
4. 人工审核和编辑
5. 保存最终病历

**融合逻辑：**
```typescript
interface FusionInput {
  audioTranscriptions: Transcription[]
  imageDocuments: ImageDocument[]
  manualInputs: Record<string, any>
  uploadedFiles: File[]
  templateId: string
}

interface FusionOutput {
  medicalRecord: MedicalRecord
  confidence: number
  sources: Source[]
  suggestions: string[]
}

interface Source {
  type: 'audio' | 'image' | 'manual' | 'file'
  content: string
  confidence: number
}
```

### 4. 病历模版系统

**功能描述：**
- 支持多种病历模版
- 模版可配置和扩展
- 自动匹配和填充

**模版类型：**
- 门诊病历
- 住院病历
- 急诊病历
- 专科病历（内科、外科、儿科等）

**模版结构：**
```typescript
interface MedicalTemplate {
  id: string
  name: string
  type: 'outpatient' | 'inpatient' | 'emergency' | 'specialty'
  department: string
  fields: TemplateField[]
  rules: ValidationRule[]
}

interface TemplateField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'date' | 'number'
  required: boolean
  defaultValue?: any
  options?: string[]
  dataSource?: 'audio' | 'image' | 'manual' | 'ai'
}
```

## 🏗️ 系统架构

### 前端架构
```
智能病历平台/
├── app/
│   ├── recording/              # 录音功能
│   │   ├── page.tsx           # 录音页面
│   │   └── components/        # 录音组件
│   ├── ocr/                   # 图像识别
│   │   ├── page.tsx           # OCR页面
│   │   └── components/        # OCR组件
│   ├── fusion/                # 多模态融合
│   │   ├── page.tsx           # 融合页面
│   │   └── components/        # 融合组件
│   └── templates/             # 模版管理
│       ├── page.tsx           # 模版列表
│       └── [id]/page.tsx      # 模版详情
├── components/
│   ├── audio/                 # 音频组件
│   ├── image/                 # 图像组件
│   └── fusion/                # 融合组件
└── lib/
    ├── audio.ts               # 音频处理
    ├── ocr.ts                 # OCR处理
    └── fusion.ts              # 融合引擎
```

### 后端架构
```
API Routes/
├── api/
│   ├── audio/                 # 音频API
│   │   ├── upload/route.ts
│   │   ├── transcribe/route.ts
│   │   └── diarization/route.ts
│   ├── ocr/                   # OCR API
│   │   ├── upload/route.ts
│   │   ├── recognize/route.ts
│   │   └── extract/route.ts
│   ├── fusion/                # 融合API
│   │   ├── generate/route.ts
│   │   └── review/route.ts
│   └── templates/             # 模版API
│       ├── route.ts
│       └── [id]/route.ts
```

### 数据库模型扩展
```prisma
model AudioRecording {
  id          String         @id @default(cuid())
  patientId   String
  recordId    String?
  audioUrl    String
  duration    Int
  createdAt   DateTime      @default(now())
  transcriptions Transcription[]
  patient     Patient        @relation(fields: [patientId], references: [id])
  record      MedicalRecord? @relation(fields: [recordId], references: [id])
}

model Transcription {
  id           String   @id @default(cuid())
  recordingId  String
  speakerId    String
  speakerLabel String
  text         String
  startTime    Float
  endTime      Float
  confidence   Float
  recording    AudioRecording @relation(fields: [recordingId], references: [id])
}

model ImageDocument {
  id            String         @id @default(cuid())
  patientId     String
  recordId      String?
  imageUrl      String
  type          String
  extractedData Json
  createdAt     DateTime       @default(now())
  patient       Patient        @relation(fields: [patientId], references: [id])
  record        MedicalRecord? @relation(fields: [recordId], references: [id])
}

model MedicalTemplate {
  id          String           @id @default(cuid())
  name        String
  type        String
  department  String
  fields      Json
  rules       Json
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  records     MedicalRecord[]
}

model MedicalRecord {
  id          String           @id @default(cuid())
  patientId   String
  templateId  String?
  chiefComplaint String
  presentIllness String
  pastHistory String
  familyHistory String
  physicalExam String
  diagnosis   String
  treatment   String
  status      String           @default("draft")
  fusionData  Json?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  patient     Patient          @relation(fields: [patientId], references: [id])
  template    MedicalTemplate? @relation(fields: [templateId], references: [id])
  recordings  AudioRecording[]
  images      ImageDocument[]
}
```

## 🔧 技术选型

### 语音识别
- **推荐**：Azure Speech Service（支持说话人分离）
- **备选**：阿里云语音识别（国内访问快）
- **本地**：Pyannote.audio + Whisper（免费但需要GPU）

### OCR识别
- **推荐**：百度OCR API（身份证识别准确率高）
- **备选**：腾讯云OCR
- **前端**：Tesseract.js（免费但准确率较低）

### 多模态融合
- **推荐**：OpenAI GPT-4（最强能力）
- **备选**：阿里通义千问（国内访问快）
- **本地**：Llama 3（免费但需要GPU）

## 📝 实施计划

### 阶段一：基础功能（2-3周）
1. 录音功能
2. 基础语音转文字
3. 图像上传和预览
4. OCR识别功能

### 阶段二：高级功能（3-4周）
1. 说话人分离
2. 身份证识别
3. 病历资料识别
4. 多模态数据收集

### 阶段三：融合引擎（2-3周）
1. LLM集成
2. 病历生成
3. 模版匹配
4. 人工审核

### 阶段四：优化完善（1-2周）
1. 性能优化
2. 用户体验优化
3. 错误处理
4. 测试和部署

## 💰 成本估算

### API调用成本
- **Azure Speech**：$1/小时（说话人分离）
- **百度OCR**：¥0.001/次（身份证识别）
- **OpenAI GPT-4**：$0.03/1K tokens

### 预估月成本（1000次使用）
- 语音识别：$100
- OCR识别：¥10
- LLM调用：$30
- **总计**：约$150/月

## 🚀 快速开始

### 本地开发
1. 安装依赖
2. 配置API密钥
3. 启动开发服务器
4. 测试各项功能

### 生产部署
1. 准备API服务账户
2. 配置环境变量
3. 部署到Netlify
4. 配置数据库

## 📞 联系方式

- **开发者**：周宏锋
- **电话**：13609737049
- **邮箱**：13609737049@139.com