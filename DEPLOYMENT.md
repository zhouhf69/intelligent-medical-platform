# 智能病历录入系统 - Netlify 部署指南

## 前置要求

1. 一个 Netlify 账户（免费账户即可）
2. 一个 PostgreSQL 数据库（推荐使用 Supabase、Neon 或 Railway）
3. Git 账户（GitHub、GitLab 或 Bitbucket）

## 部署步骤

### 1. 准备数据库

#### 使用 Supabase（推荐）

1. 访问 [supabase.com](https://supabase.com) 并创建免费账户
2. 创建一个新项目
3. 在项目设置中找到 "Database" 部分
4. 复制 "Connection string"（连接字符串）
5. 连接字符串格式：`postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

#### 使用 Neon

1. 访问 [neon.tech](https://neon.tech) 并创建免费账户
2. 创建一个新项目
3. 复制 "Connection string"
4. 连接字符串格式：`postgresql://[user]:[password]@[host]/[database]?sslmode=require`

### 2. 配置环境变量

在 Netlify 中配置以下环境变量：

1. 登录 Netlify 控制台
2. 进入你的站点设置
3. 找到 "Environment variables" 部分
4. 添加以下变量：

```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
NODE_ENV=production
```

**重要：** 将 `DATABASE_URL` 替换为你从数据库提供商获得的实际连接字符串。

### 3. 连接 Git 仓库

#### 方法一：通过 Netlify 控制台

1. 在 Netlify 中点击 "Add new site" > "Import an existing project"
2. 选择你的 Git 提供商（GitHub、GitLab 或 Bitbucket）
3. 授权 Netlify 访问你的仓库
4. 选择包含此项目的仓库

#### 方法二：通过 Netlify CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 初始化站点
netlify init

# 部署
netlify deploy --prod
```

### 4. 配置构建设置

Netlify 会自动检测 Next.js 项目，但你可以手动配置：

**Build command:**
```
npm run build
```

**Publish directory:**
```
.next
```

**Node version:**
```
18
```

### 5. 部署

1. 点击 "Deploy site" 按钮
2. 等待构建完成（通常需要 2-5 分钟）
3. 构建成功后，你将获得一个 Netlify 提供的 URL

### 6. 初始化数据库

部署成功后，需要初始化数据库结构：

1. 在本地运行以下命令生成 Prisma Client：
```bash
npm run db:generate
```

2. 推送数据库结构到云数据库：
```bash
npm run db:push
```

或者使用迁移：
```bash
npm run db:migrate
```

## 本地开发

在本地开发时，使用 SQLite 数据库：

1. 复制 `.env.example` 为 `.env`
2. 在 `.env` 中设置：
```
DATABASE_URL="file:./dev.db"
```

3. 运行开发服务器：
```bash
npm run dev
```

## 常见问题

### Q: 构建失败怎么办？

A: 检查以下几点：
- 确保 `DATABASE_URL` 环境变量已正确设置
- 检查 Node.js 版本是否设置为 18
- 查看构建日志中的错误信息

### Q: 数据库连接失败？

A: 确认：
- 数据库连接字符串格式正确
- 数据库允许来自 Netlify 的连接
- 数据库用户有足够的权限

### Q: 如何自定义域名？

A: 在 Netlify 控制台中：
1. 进入 "Domain settings"
2. 点击 "Add custom domain"
3. 按照提示配置 DNS 记录

### Q: 如何更新应用？

A: 只需将更改推送到 Git 仓库，Netlify 会自动重新部署。

## 性能优化

1. **启用缓存**：Netlify 会自动缓存静态资源
2. **使用 CDN**：Netlify 提供全球 CDN
3. **图片优化**：Next.js 会自动优化图片
4. **代码分割**：Next.js 默认支持代码分割

## 安全建议

1. **环境变量**：永远不要将敏感信息提交到 Git
2. **HTTPS**：Netlify 默认启用 HTTPS
3. **数据库安全**：使用强密码，限制访问 IP
4. **定期备份**：定期备份数据库

## 监控和日志

Netlify 提供：
- 构建日志
- 函数日志
- 网站分析
- 性能监控

在 Netlify 控制台的 "Functions" 和 "Deploys" 部分查看日志。

## 成本估算

- **Netlify**：免费套餐足够个人使用
  - 100GB 带宽/月
  - 300 分钟构建时间/月
  - 无限站点

- **Supabase**：免费套餐
  - 500MB 数据库存储
  - 1GB 文件存储
  - 2GB 带宽/月

- **Neon**：免费套餐
  - 0.5GB 数据库存储
  - 无限项目
  - 自动休眠

## 技术支持

如果遇到问题，可以：
- 查看 [Netlify 文档](https://docs.netlify.com)
- 查看 [Prisma 文档](https://www.prisma.io/docs)
- 查看 [Next.js 文档](https://nextjs.org/docs)

## 更新日志

- 2024-01-15：初始版本发布
- 支持 PostgreSQL 数据库
- 配置 Netlify 部署
- 添加环境变量管理