@echo off
chcp 65001
cls
echo ============================================
echo    智能病历平台 - 自动部署脚本
echo ============================================
echo.
echo 正在准备部署...
echo.

REM 检查public文件夹是否存在
if not exist "public\index.html" (
    echo 错误：public/index.html 不存在！
    pause
    exit /b 1
)

echo ✅ public文件夹已准备就绪
echo.
echo ============================================
echo 部署方式选择
echo ============================================
echo.
echo 方式1：打开Netlify管理后台手动部署
echo 方式2：使用GitHub Actions自动部署
echo.
echo 推荐使用方式1，拖拽public文件夹即可部署
echo.
echo ============================================
echo 正在打开Netlify管理后台...
echo ============================================
start https://app.netlify.com/sites/polite888
echo.
echo 请在浏览器中完成部署：
echo 1. 向下滚动找到 "Deploy manually" 区域
echo 2. 将 D:\养老市场\public 文件夹拖拽到指定区域
echo 3. 等待部署完成
echo.
echo ============================================
echo 部署完成后，访问：
echo https://polite888.netlify.app
echo ============================================
pause