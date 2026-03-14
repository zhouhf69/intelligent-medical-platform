# 智能病历平台

智能病历源头生成与全流程质控平台

## 项目信息

- **平台名称**：智能病历平台
- **版本**：1.0.0
- **开发者**：周宏锋
- **联系电话**：13609737049
- **电子邮箱**：13609737049@139.com

## 功能特性

### 核心功能
- ✅ 患者信息管理（创建、编辑、查看、删除）
- ✅ 病历管理（创建、编辑、查看、审核）
- ✅ 语音输入（支持中文语音识别）
- ✅ 病历状态管理（草稿、已提交、已审核、已驳回）
- ✅ 搜索和分页
- ✅ 数据导出（JSON/CSV）
- ✅ 数据统计
- ✅ 打印功能
- ✅ Toast 通知
- ✅ 响应式设计

### 工作流程
1. 医生录入患者信息和病历 → 保存为草稿
2. 在待办事项中查看待确认的草稿病历
3. 提交病历进行审核
4. 审核人员审核病历（通过或驳回）
5. 已审核的病历可以打印
6. 在统计仪表板查看数据概览
7. 导出数据进行备份或分析

## 技术栈

- **前端框架**：Next.js 14
- **编程语言**：TypeScript
- **样式框架**：Tailwind CSS
- **UI 组件**：Radix UI
- **状态管理**：Zustand
- **ORM**：Prisma
- **数据库**：PostgreSQL（生产）/ SQLite（开发）
- **语音识别**：Web Speech API

## 快速开始

### 本地开发

1. 克隆仓库
```bash
git clone <your-repo-url>
cd intelligent-medical-platform
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```
DATABASE_URL="file:./dev.db"
```

4. 初始化数据库
```bash
npm run db:generate
npm run db:push
```

5. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3002

### 生产部署

#### 方法一：Netlify 部署

1. 准备数据库
   - 推荐：[Supabase](https://supabase.com)（免费）
   - 或：[Neon](https://neon.tech)（免费）

2. 创建 GitHub 仓库
   - 访问 [GitHub](https://github.com)
   - 创建新仓库：`intelligent-medical-platform`

3. 推送代码到 GitHub
```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

4. 连接 Netlify
   - 登录 [Netlify](https://app.netlify.com)
   - 点击 "Add new site" > "Import an existing project"
   - 选择 GitHub 仓库
   - 配置环境变量：
     ```
     DATABASE_URL=postgresql://user:password@host:5432/database
     NODE_ENV=production
     ```
   - 点击 "Deploy site"

5. 初始化生产数据库
```bash
npm run db:push
```

详细部署说明请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

#### 方法二：Vercel 部署

1. 推送代码到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 点击 "New Project"
4. 导入 GitHub 仓库
5. 配置环境变量
6. 点击 "Deploy"

## 项目结构

```
intelligent-medical-platform/
├── app/                    # Next.js 应用目录
│   ├── about/             # 关于页面
│   ├── api/               # API 路由
│   │   ├── export/        # 数据导出 API
│   │   ├── patients/      # 患者 API
│   │   ├── records/       # 病历 API
│   │   ├── stats/         # 统计 API
│   │   └── todos/         # 待办事项 API
│   ├── dashboard/         # 统计仪表板
│   ├── patients/          # 患者管理页面
│   ├── records/           # 病历管理页面
│   └── todos/            # 待办事项页面
├── components/           # React 组件
│   └── ui/              # UI 组件
├── hooks/               # 自定义 Hooks
├── lib/                 # 工具函数
├── prisma/              # Prisma 配置
│   └── schema.prisma   # 数据库模型
├── public/              # 静态资源
└── types/              # TypeScript 类型定义
```

## 数据库模型

### Patient（患者）
- id: 唯一标识符
- name: 姓名
- age: 年龄
- gender: 性别
- idCard: 身份证号
- phone: 联系电话
- admissionDate: 入院日期
- createdAt: 创建时间
- updatedAt: 更新时间

### MedicalRecord（病历）
- id: 唯一标识符
- patientId: 患者ID（外键）
- chiefComplaint: 主诉
- presentIllness: 现病史
- pastHistory: 既往史
- familyHistory: 家族史
- physicalExam: 体格检查
- diagnosis: 诊断
- treatment: 诊疗计划
- status: 状态（draft/submitted/approved/rejected）
- createdAt: 创建时间
- updatedAt: 更新时间

## API 接口

### 患者 API
- `GET /api/patients` - 获取患者列表
- `POST /api/patients` - 创建患者
- `GET /api/patients/[id]` - 获取患者详情
- `PUT /api/patients/[id]` - 更新患者
- `DELETE /api/patients/[id]` - 删除患者

### 病历 API
- `GET /api/records` - 获取病历列表
- `POST /api/records` - 创建病历
- `GET /api/records/[id]` - 获取病历详情
- `PUT /api/records/[id]` - 更新病历
- `DELETE /api/records/[id]` - 删除病历

### 其他 API
- `GET /api/stats` - 获取统计数据
- `GET /api/todos` - 获取待办事项
- `GET /api/export` - 导出数据

## 开发命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 数据库
npm run db:generate    # 生成 Prisma Client
npm run db:push       # 推送数据库结构
npm run db:migrate     # 运行数据库迁移
npm run db:studio     # 打开 Prisma Studio
```

## 浏览器支持

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 语音识别需要支持的浏览器

## 许可证

MIT License

## 联系方式

- **开发者**：周宏锋
- **电话**：13609737049
- **邮箱**：13609737049@139.com

## 更新日志

### v1.0.0 (2024-01-15)
- ✅ 初始版本发布
- ✅ 完整的病历管理功能
- ✅ 语音输入支持
- ✅ 数据导出功能
- ✅ 统计分析功能
- ✅ 打印功能
- ✅ Netlify 部署配置