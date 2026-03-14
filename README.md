# 智能病历录入系统

## 项目简介

智能病历录入系统是一个生产级的Web应用，专为医疗场景设计，支持离线使用、移动端适配、语音输入等功能。

## 核心特性

### PWA 支持
- ✅ 离线工作模式
- ✅ 移动端适配
- ✅ 可安装为桌面应用
- ✅ 后台同步

### 智能录入
- 🎤 语音输入支持
- 📷 拍照上传
- 💾 自动保存
- 🔄 离线数据同步

### UI 组件
- 🎨 现代化设计
- 📱 响应式布局
- 🌓 深色模式支持
- ♿ 无障碍访问

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- Docker (可选，用于部署)

### 安装依赖
```bash
npm install
```

### 初始化数据库
```bash
npm run db:generate
npm run db:push
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看应用

## 部署

### 使用 Docker 部署
```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows
docker-compose up -d
```

### 手动部署
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 项目结构

```
.
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── patients/             # 患者管理 API
│   │   │   ├── route.ts         # 患者列表、创建患者
│   │   │   └── [id]/route.ts    # 患者详情、更新、删除
│   │   ├── records/              # 病历管理 API
│   │   │   ├── route.ts         # 病历列表、创建病历
│   │   │   └── [id]/route.ts    # 病历详情、更新、删除
│   │   └── todos/               # 待办事项 API
│   │       └── route.ts         # 待办列表
│   ├── globals.css               # 全局样式
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页（病历录入）
│   ├── patients/                # 患者管理页面
│   │   ├── page.tsx            # 患者列表
│   │   ├── new/page.tsx        # 新建患者
│   │   └── [id]/page.tsx      # 患者详情
│   ├── todos/                   # 待办事项页面
│   │   └── page.tsx           # 待办列表
│   └── records/                 # 病历管理页面
│       └── [id]/page.tsx       # 病历详情
├── components/                  # React 组件
│   ├── ui/                     # UI 组件库
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   └── theme-provider.tsx      # 主题提供者
├── hooks/                      # 自定义 Hooks
│   └── use-toast.ts            # Toast 提示 Hook
├── lib/                        # 工具函数
│   ├── utils.ts                # 通用工具函数
│   ├── date-utils.ts           # 日期处理函数
│   └── validation.ts           # 数据验证函数
├── store/                      # 状态管理
│   ├── patient-store.ts        # 患者状态管理
│   └── record-store.ts         # 病历状态管理
├── types/                      # TypeScript 类型定义
│   └── index.ts               # 通用类型定义
├── prisma/                     # 数据库配置
│   └── schema.prisma           # 数据模型
├── public/                     # 静态资源
│   ├── manifest.json           # PWA 配置
│   ├── sw.js                  # Service Worker
│   └── offline.html           # 离线页面
├── package.json                # 项目依赖
├── tsconfig.json              # TypeScript 配置
├── tailwind.config.js         # Tailwind CSS 配置
├── next.config.js             # Next.js 配置
├── Dockerfile                 # Docker 镜像配置
├── docker-compose.yml         # Docker Compose 配置
├── deploy.sh                 # Linux/Mac 部署脚本
├── start.bat                 # Windows 启动脚本
└── README.md                 # 项目文档
```

## 技术栈

- **框架**: Next.js 14
- **UI**: React 18 + Tailwind CSS
- **数据库**: Prisma + SQLite/PostgreSQL
- **状态管理**: Zustand
- **表单**: React Hook Form + Zod
- **PWA**: next-pwa
- **图标**: Lucide React

## 功能说明

### 患者管理
- 新建患者信息
- 查看患者列表
- 搜索患者（支持姓名、身份证号、电话搜索）
- 查看患者详情
- 编辑患者信息
- 删除患者

### 病历管理
- 新建病历记录
- 查看病历列表
- 查看病历详情
- 编辑病历信息
- 删除病历
- 病历状态管理（草稿、已提交、已审核、已驳回）

### 待办事项
- 查看待确认病历
- 查看待审核病历
- 按优先级筛选
- 快速跳转到详情

### 病历录入
- 主诉录入
- 现病史
- 既往史
- 家族史
- 体格检查
- 初步诊断
- 诊疗计划

### 智能功能
- 语音转文字
- 自动保存
- 离线缓存
- 数据同步
- 表单验证
- 数据格式化

## 开发指南

### 添加新的 API 路由
在 `app/api/` 目录下创建新的路由文件

### 添加新的 UI 组件
在 `components/ui/` 目录下创建新的组件文件

### 修改数据库模型
编辑 `prisma/schema.prisma` 文件，然后运行：
```bash
npm run db:generate
npm run db:push
```

## 常见问题

### Q: 如何启用语音输入？
A: 语音输入功能需要浏览器支持 Web Speech API，推荐使用 Chrome 或 Edge 浏览器。

### Q: 离线模式下数据如何保存？
A: 离线模式下数据会保存在本地 IndexedDB 中，联网后会自动同步到服务器。

### Q: 如何自定义主题颜色？
A: 修改 `app/globals.css` 中的 CSS 变量即可。

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue。