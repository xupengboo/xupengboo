---
title: GitHub 图床配置
order: 2
icon: mdi:github
---

# Typora：PicGo设置GitHub图床

## 1. GitHub配置（专用于图床）

- 登录GitHub首页，先准备一个GitHub项目（权限最好是：public，不然其他人访问不到），专用于图床 。

- 打开【Settings】

![image-20240813101253670](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240813101253670.png)

- 点击 【Developer settings】

![image-20240813101334301](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240813101334301.png)

- 选择【Tokens】，点击【Generate a personal access token】

![image-20240813101440859](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240813101440859.png)

- 填写相关信息，并且 选择【repo】，点击 生成。

![image-20240813101649572](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240813101649572.png)

- 然后，会生成一条Token信息，记得保存。

![image-20240813101750688](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240813101750688.png)

## 2. Typora设置

1. 下载Typora，并且安装。
2. 打开Typora，点击左上角菜单栏的【文件】，点击弹出框里下方的【偏好设置】

![image-20240813102029856](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240813102029856.png)

3. 打开页面，左侧选择【图像】，图像里的设置按下设置：

   - 设置插入图片时为【上传图片】

   - 勾选【对本地位置的图片应用上述规则】
   - 在上传服务中选择【PicGo(app)】
   - 在路径中选择【PicGo安装目录PicGo.exe】

![image-20240813102115620](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240813102115620.png)



## 3. PicGo设置

1. 下载PicGo，并且安装。
2. 打开运行PicGo，左侧打开【图床设置】，选择【GitHub图床】。
3. 配置相关参数：
   - 仓库名：表示远程仓库地址，固定格式 **Github用户名/仓库名** ，前期准备用到的仓库。
   - 分支名：表示分支，**默认填入master**，需要根据自己Github上的分支进行填写，看个人设置。
   - Token：**填入Github中生成的Token**。
   - 存储路径：项目上，可以自定义一个文件路径，**一般在GitHub项目里面创建一个img目录，路径配置为：img/ 就行了**。
   - 自定义域名：看个人是否需要。

![image-20240813103255473](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240813103255473.png)

## 4. 验证图片上传

在Typora偏好设置的那个界面，点击左下的【验证图片上传选项】，出现问题查看提示日志，解决即可。

