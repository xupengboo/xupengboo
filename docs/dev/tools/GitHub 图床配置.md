---
title: GitHub 图床配置
outline: deep
---

# GitHub 图床配置（Typora + PicGo）

> 使用 GitHub 仓库作为免费图床，配合 PicGo 实现 Typora 截图自动上传，写文档时图片一键同步到云端，彻底告别本地图片路径失效问题。

---

## 一、GitHub 准备

### 1. 创建图床仓库

新建一个专用仓库（如 `my-images`），可见性选 **Public**。

:::warning 必须设为 Public
私有仓库的图片链接外部无法访问，其他人打开你的文档会看不到图片。
:::

### 2. 生成 Personal Access Token

Token 是 PicGo 上传图片时的身份凭证。

**操作路径**：右上角头像 → `Settings` → 左侧最底部 `Developer settings` → `Personal access tokens` → `Tokens (classic)` → `Generate new token`

![Settings 入口](/public/images/image-20240813101253670.png)

![Developer settings](/public/images/image-20240813101334301.png)

![生成 Token](/public/images/image-20240813101440859.png)

填写 Token 说明（如 `picgo-image-bed`），过期时间按需选择，权限勾选 **`repo`**，点击底部 `Generate token`。

![勾选 repo 权限](/public/images/image-20240813101649572.png)

生成后页面会显示 Token 值，**立即复制保存**，离开页面后将无法再次查看。

![复制保存 Token](/public/images/image-20240813101750688.png)

:::danger Token 安全提示
- Token 相当于账号密码，**绝对不能提交到任何公开仓库**
- 建议存入密码管理工具（如 1Password、Bitwarden）
- 如果不慎泄露，立即到 GitHub 撤销该 Token 重新生成
  :::

---

## 二、PicGo 配置

1. 下载安装 [PicGo](https://github.com/Molunerfinn/PicGo/releases)
2. 打开 PicGo，左侧选择 `图床设置` → `GitHub图床`
3. 按下表填写配置：

| 配置项 | 填写说明 |
|---|---|
| **仓库名** | `GitHub用户名/仓库名`，如 `xupengboo/my-images` |
| **分支名** | 填写你仓库的实际分支名，GitHub 新建仓库默认是 `main`（不是 `master`） |
| **Token** | 粘贴上一步生成的 Token |
| **存储路径** | 图片存放的子目录，建议填 `img/`（对应仓库中的 img 文件夹） |
| **自定义域名** | 可选，见下方说明 |

![PicGo GitHub 图床配置](/public/images/image-20240813103255473.png)

填写完成后点击 **设为默认图床**，再点击 **确定**。

---

## 三、Typora 配置

1. 下载安装 [Typora](https://typora.io/)
2. 打开 Typora：`文件` → `偏好设置` → 左侧 `图像`
3. 按如下配置：
    - 插入图片时：选择 `上传图片`
    - 勾选 `对本地位置的图片应用上述规则`
    - 上传服务：选择 `PicGo(app)`
    - PicGo 路径：选择 PicGo 的安装路径（`PicGo.exe`）

![Typora 图像设置](/public/images/image-20240813102115620.png)

---

## 四、验证上传

在 Typora 偏好设置的图像页面，点击左下角 `验证图片上传选项`。

- ✅ 显示上传成功 → 配置完成，之后截图粘贴到 Typora 会自动上传并替换为链接
- ❌ 上传失败 → 查看 PicGo 的日志（PicGo 右上角 `日志`），常见原因见下表

| 常见错误 | 原因 | 解决方法 |
|---|---|---|
| 401 Unauthorized | Token 填写有误或已过期 | 重新生成 Token 并更新 |
| 404 Not Found | 仓库名或分支名有误 | 检查仓库名格式和分支名 |
| 上传超时 | 网络问题 | 检查网络，或配置代理 |
| 文件已存在 | 同名文件重复上传 | PicGo 设置中开启时间戳重命名 |

---

## 五、自定义域名（CDN 加速）

默认的 GitHub raw 链接格式为：

```
https://raw.githubusercontent.com/用户名/仓库名/分支/路径
```

国内访问 `raw.githubusercontent.com` 速度时好时坏，可以通过自定义域名配置 CDN 加速。

### jsDelivr（免费，但国内不稳定）

格式：
```
https://cdn.jsdelivr.net/gh/用户名/仓库名@分支/路径
```

示例：
```
https://cdn.jsdelivr.net/gh/xupengboo/my-images@main/img/
```

:::warning jsDelivr 国内现状
jsDelivr 的国内 CDN 节点自 2021 年底起在部分地区访问不稳定，不再是"稳定可靠"的方案。如果你的文档主要面向国内读者，建议优先考虑以下替代方案。
:::

### 替代方案对比

| 方案 | 费用 | 国内速度 | 稳定性 | 推荐度 |
|---|---|---|---|---|
| GitHub raw（默认） | 免费 | 一般 | 稳定 | ⭐⭐⭐ |
| jsDelivr | 免费 | 不稳定 | 一般 | ⭐⭐ |
| Cloudflare R2 | 免费额度大 | 良好 | 稳定 | ⭐⭐⭐⭐ |
| 阿里云 OSS + CDN | 按量付费 | 极快 | 稳定 | ⭐⭐⭐⭐⭐ |
| 腾讯云 COS + CDN | 按量付费 | 极快 | 稳定 | ⭐⭐⭐⭐⭐ |

> 如果只是个人文档/博客，GitHub raw 直链 + 偶尔手动更新已经够用。需要稳定国内访问速度的话，推荐直接上阿里云 OSS，成本极低（几毛钱/月）。
