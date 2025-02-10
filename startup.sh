#!/bin/bash

# 输入密码
# read -sp "Enter the encryption password: " PASSWORD
# echo  # 换行（避免密码输入后和下一行提示混在一起）

# 设置镜像名称
IMAGE_NAME="xupengboo:2.0.0"
CONTAINER_NAME="xupengboo"
BRANCH="master"

echo "Git pull ${BRANCH}."
git pull origin ${BRANCH}

# 步骤 1: 构建 Docker 镜像
echo "Building Docker image ${IMAGE_NAME}..."
docker build -t ${IMAGE_NAME} .

# 步骤 2: 移除已存在的容器（如果有）
echo "Removing existing container ${CONTAINER_NAME} (if exists)..."
docker rm -f ${CONTAINER_NAME} || true  # 忽略没有找到容器的错误

# 步骤 3: 运行新的容器
echo "Running new container ${CONTAINER_NAME} from image ${IMAGE_NAME}..."
docker run -d -p 80:80 --name ${CONTAINER_NAME} -e ENCRYPT_PASSWORD="123456" ${IMAGE_NAME}

# 步骤 4: 删除所有悬挂的镜像（没有标签的镜像）
echo "Removing dangling images..."
docker image prune -f

# 额外：如果你想删除所有未使用的镜像和容器，也可以启用以下命令：
# docker system prune -f

echo "Cleanup process completed."
