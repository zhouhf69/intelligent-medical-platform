@echo off
chcp 65001
cls
echo ============================================
echo    智能病历平台 - Netlify部署脚本
echo ============================================
echo.
echo 正在检查Git状态...
git status
echo.
echo 确保所有更改已提交...
git add .
git commit -m "Prepare for Netlify deployment" 2>nul
git push
echo.
echo ============================================
echo ✅ 代码已推送到GitHub
echo ============================================
echo.
echo 请按照以下步骤完成Netlify部署：
echo.
echo 步骤1: 访问Netlify网站
echo    https://app.netlify.com
echo.
echo 步骤2: 使用GitHub账户登录
echo.
echo 步骤3: 点击 "Add new site" -^> "Import an existing project"
echo.
echo 步骤4: 选择GitHub，然后选择 intelligent-medical-platform 仓库
echo.
echo 步骤5: 配置构建设置：
echo    Build command: npm run build
echo    Publish directory: .next
echo    Node version: 18
echo.
echo 步骤6: 添加环境变量：
echo    NODE_ENV=production
echo    DATABASE_URL=（从Supabase获取）
echo.
echo 步骤7: 点击 "Deploy site"
echo.
echo ============================================
echo 按任意键打开Netlify网站...
echo ============================================
pause >nul
start https://app.netlify.com
