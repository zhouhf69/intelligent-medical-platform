@echo off
echo 🚀 正在启动智能病历录入系统...

echo 📦 检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
)

echo 🗄️  初始化数据库...
call npx prisma generate
call npx prisma db push

echo 🔄 启动开发服务器...
call npm run dev

pause