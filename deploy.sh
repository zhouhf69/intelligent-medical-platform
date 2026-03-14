#!/bin/bash

echo "🚀 开始部署智能病历录入系统..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

# 构建并启动服务
echo "📦 构建Docker镜像..."
docker-compose build

echo "🔄 启动服务..."
docker-compose up -d

echo "✅ 部署完成！"
echo ""
echo "📱 应用访问地址：http://localhost:3000"
echo "🗄️  数据库地址：localhost:5432"
echo ""
echo "查看日志：docker-compose logs -f"
echo "停止服务：docker-compose down"