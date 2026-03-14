# GitHub 部署指南

## 第一步：创建GitHub仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角 "+" 号，选择 "New repository"
3. 仓库名称：`intelligent-medical-platform`
4. 选择 "Public" 或 "Private"
5. 点击 "Create repository"

## 第二步：推送代码到GitHub

在项目目录运行以下命令：

```bash
# 添加远程仓库（替换为你的GitHub用户名）
git remote add origin https://github.com/你的用户名/intelligent-medical-platform.git

# 重命名分支为main
git branch -M main

# 推送代码到GitHub
git push -u origin main
```

**示例：**
```bash
# 如果你的GitHub用户名是 example-user
git remote add origin https://github.com/example-user/intelligent-medical-platform.git
git branch -M main
git push -u origin main
```

## 第三步：部署到Netlify

### 1. 准备数据库

推荐使用免费的PostgreSQL数据库：

#### 选项A：Supabase（推荐）
1. 访问 [supabase.com](https://supabase.com)
2. 创建免费账户
3. 创建新项目
4. 在项目设置中找到 "Database" 部分
5. 复制 "Connection string"（连接字符串）
6. 连接字符串格式：`postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

#### 选项B：Neon
1. 访问 [neon.tech](https://neon.tech)
2. 创建免费账户
3. 创建新项目
4. 复制 "Connection string"
5. 连接字符串格式：`postgresql://[user]:[password]@[host]/[database]?sslmode=require`

### 2. 连接Netlify

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
   - Netlify会自动检测Next.js项目
   - 构建命令：`npm run build`
   - 发布目录：`.next`
   - Node.js版本：`18`

4. **配置环境变量**
   - 在 "Site settings" > "Environment variables" 中添加：
     ```
     DATABASE_URL=postgresql://user:password@host:5432/database
     NODE_ENV=production
     ```
   - **重要**：将 `DATABASE_URL` 替换为你从数据库提供商获得的实际连接字符串

5. **部署**
   - 点击 "Deploy site"
   - 等待构建完成（通常需要2-5分钟）
   - 构建成功后，你将获得一个Netlify提供的URL

### 3. 初始化生产数据库

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

## 常见问题

### Q: 推送时提示认证错误？

A: 确保你已配置GitHub凭据：
```bash
# 配置Git凭据（Windows）
git config --global credential.helper wincred

# 或使用SSH密钥
git remote add origin git@github.com:你的用户名/intelligent-medical-platform.git
```

### Q: 构建失败？

A: 检查以下几点：
- 确保 `DATABASE_URL` 环境变量已正确设置
- 检查Node.js版本是否设置为18
- 查看构建日志中的错误信息

### Q: 数据库连接失败？

A: 确认：
- 数据库连接字符串格式正确
- 数据库允许来自Netlify的连接
- 数据库用户有足够的权限

### Q: 如何自定义域名？

A: 在Netlify控制台中：
1. 进入 "Domain settings"
2. 点击 "Add custom domain"
3. 按照提示配置DNS记录

## 验证部署

部署成功后：

1. 访问Netlify提供的URL
2. 测试以下功能：
   - 创建患者
   - 创建病历
   - 语音输入
   - 数据导出
   - 统计功能

## 更新部署

当代码有更新时：

1. 提交更改到Git
   ```bash
   git add .
   git commit -m "描述你的更改"
   ```

2. 推送到GitHub
   ```bash
   git push
   ```

3. Netlify会自动检测到更改并重新部署

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
- 联系开发者：13609737049@139.com