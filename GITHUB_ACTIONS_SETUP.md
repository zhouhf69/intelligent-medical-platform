# 🔧 GitHub Actions 自动部署设置

## 概述
GitHub Actions可以在推送代码时自动部署到Netlify。

## 设置步骤

### 步骤1：获取Netlify Personal Access Token

1. 访问 https://app.netlify.com/user/applications/personal
2. 点击 "New access token"
3. 输入名称："GitHub Actions"
4. 点击 "Generate token"
5. **复制令牌**（注意：只显示一次！）

### 步骤2：配置GitHub Secrets

1. 访问 https://github.com/zhouhf69/intelligent-medical-platform/settings/secrets/actions
2. 点击 "New repository secret"
3. 添加第一个Secret：
   - **Name**: `NETLIFY_AUTH_TOKEN`
   - **Value**: 粘贴刚才复制的Netlify令牌
   - 点击 "Add secret"
4. 再次点击 "New repository secret"
5. 添加第二个Secret：
   - **Name**: `NETLIFY_SITE_ID`
   - **Value**: `0815ba26-291a-48ec-b8d2-799635d953df`
   - 点击 "Add secret"

### 步骤3：触发自动部署

有两种方式触发部署：

#### 方式A：推送代码自动部署
1. 推送任意更改到main分支
2. GitHub Actions会自动运行并部署

#### 方式B：手动触发部署
1. 访问 https://github.com/zhouhf69/intelligent-medical-platform/actions
2. 点击 "Manual Deploy to Netlify"
3. 点击 "Run workflow"
4. 选择分支 "main"
5. 点击 "Run workflow"

### 步骤4：查看部署状态

1. 访问 https://github.com/zhouhf69/intelligent-medical-platform/actions
2. 查看工作流运行状态
3. 绿色勾表示部署成功
4. 红色叉表示部署失败（点击查看日志）

---

## 部署后的网站地址

部署成功后，访问：
```
https://intelligent888.netlify.app
```

---

## 故障排除

### 问题：部署失败，提示 "Unauthorized"
**解决方案**：检查NETLIFY_AUTH_TOKEN是否正确

### 问题：部署成功但网站404
**解决方案**：检查public文件夹中是否有index.html

### 问题：工作流未触发
**解决方案**：确认代码已推送到main分支

---

## 📞 技术支持

**开发者**：周宏锋
**电话**：13609737049
**邮箱**：13609737049@139.com