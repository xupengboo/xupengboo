---
title: HTTPS 证书申请与配置
outline: deep
---

# HTTPS 证书申请与配置

> 使用 **Let's Encrypt** + **Certbot** 免费申请 SSL 证书，实现网站 HTTPS 访问。Let's Encrypt 证书有效期 90 天，Certbot 会自动续期，无需手动干预。

**前提条件：**
- 已有公网域名，并完成 DNS 解析（域名 → 服务器 IP）
- 服务器 **80 端口**必须可以公网访问（certbot 验证域名所有权时需要）

---

## 一、安装 Certbot

```bash
# 查看 CentOS 版本，确认安装方式
cat /etc/redhat-release
```

::: code-group

```bash [CentOS 7]
# 安装 certbot 核心
yum install -y certbot

# 安装 Nginx 插件（Python2 环境）
yum install -y python2-certbot-nginx
```

```bash [CentOS 8 / 9]
# 安装 certbot 核心
yum install -y certbot

# 安装 Nginx 插件（Python3 环境）
yum install -y python3-certbot-nginx
```

```bash [Ubuntu / Debian]
apt update
apt install -y certbot python3-certbot-nginx
```

:::

---

## 二、申请证书

根据部署方式选择对应模式：

| 模式 | 适用场景 | 特点 |
|---|---|---|
| **Nginx 模式** | 直接用 Nginx 部署（非 Docker） | 全自动，certbot 直接改 nginx.conf |
| **Webroot 模式** | Docker 部署，或手动管理 Nginx | 需手动挂载目录，配置灵活 |
| **Standalone 模式** | 服务器上没有 Web 服务 | certbot 自己起一个临时 HTTP 服务 |

### 方式一：Nginx 模式（推荐，非 Docker）

适合直接在宿主机运行 Nginx 的场景，certbot 会自动修改 nginx.conf 完成验证并写入证书配置。

```bash
# 确保 nginx 正在运行，且 80 端口可访问
certbot --nginx -d your-domain.com -d www.your-domain.com
```

certbot 会自动完成：
- 域名所有权验证
- 下载证书到 `/etc/letsencrypt/live/your-domain.com/`
- 修改 nginx.conf，添加 HTTPS 配置

### 方式二：Webroot 模式（Docker 场景）

certbot 通过在指定目录放一个验证文件，让 Let's Encrypt 服务器来访问它来证明域名所有权。Docker 部署时需要把这个目录挂载出来。

:::warning 顺序很重要
必须**先启动容器**（挂载验证目录），再执行 certbot 申请。顺序反了会导致 Let's Encrypt 无法访问验证文件，申请失败。
:::

**Step 1 — 启动容器，挂载验证目录**

```bash
docker run -d \
  -p 80:80 \
  -p 443:443 \
  --name my-nginx \
  --restart always \
  -v /home/www/ssl:/usr/share/nginx/html \
  nginx:alpine
```

> `-v /home/www/ssl:/usr/share/nginx/html` 将宿主机的 `/home/www/ssl` 挂载到容器的网站根目录，certbot 会在这里写入验证文件。

**Step 2 — 申请证书**

```bash
certbot certonly \
  --webroot \
  -w /home/www/ssl \
  -d your-domain.com \
  -d www.your-domain.com \
  --email your@email.com \
  --agree-tos \
  --non-interactive
```

申请成功后，证书文件保存在：

```
/etc/letsencrypt/live/your-domain.com/
├── fullchain.pem   # 证书文件（nginx 配置用这个）
├── privkey.pem     # 私钥文件（nginx 配置用这个）
├── cert.pem        # 仅证书（不含中间链）
└── chain.pem       # 中间链证书
```

:::warning 软链接问题（重要）
`/etc/letsencrypt/live/` 下的文件是**软链接**，实际文件在 `/etc/letsencrypt/archive/` 目录下。

Docker 容器无法识别宿主机的软链接，直接 `-v` 挂载 `live/` 目录到容器会导致证书文件读取失败。

**解决方案：挂载 `archive/` 真实目录，或挂载整个 `/etc/letsencrypt/`：**

```bash
# 推荐：挂载整个 letsencrypt 目录，容器内软链接可以正常解析
-v /etc/letsencrypt:/etc/letsencrypt:ro
```
:::

---

## 三、配置 Nginx 启用 HTTPS

证书申请完成后，需要在 nginx.conf 中配置 443 端口。

### 基础 HTTPS 配置

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # HTTP 自动跳转 HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com www.your-domain.com;

    # 证书路径（软链接问题见上方说明）
    ssl_certificate     /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # 推荐的 SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # 网站根目录
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

### Docker 场景完整示例

```bash
docker run -d \
  -p 80:80 \
  -p 443:443 \
  --name my-app \
  --restart always \
  -v /home/www/dist:/usr/share/nginx/html \
  -v /home/www/nginx.conf:/etc/nginx/nginx.conf \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  nginx:alpine
```

> - `/home/www/dist` — 前端打包产物
> - `/home/www/nginx.conf` — 包含 HTTPS 配置的 nginx.conf
> - `/etc/letsencrypt:ro` — 证书目录只读挂载，`:ro` 防止容器内意外修改证书

---

## 四、证书自动续期

Let's Encrypt 证书有效期 90 天，Certbot 安装后会自动创建定时任务，无需手动续期。

### 查看定时任务

```bash
# 查看 certbot 相关定时器
systemctl list-timers | grep certbot

# 或查看 crontab（部分系统用 cron 而不是 systemd timer）
crontab -l
```

### 测试续期（不会实际申请，仅验证流程）

```bash
certbot renew --dry-run
```

输出 `Congratulations, all simulated renewals succeeded` 表示续期配置正常。

### 手动触发续期

```bash
# 续期所有即将到期的证书（到期前 30 天内才会实际执行）
certbot renew

# 续期后重载 Nginx（让新证书生效）
nginx -s reload
# 或 Docker 场景：
docker exec my-nginx nginx -s reload
```

### 手动添加定时任务

安装 certbot 后，先确认是否已自动创建定时任务：

```bash
# 查看 systemd timer
systemctl list-timers | grep certbot

# 查看 crontab
crontab -l
```

如果两条命令均无输出，说明没有自动创建，需要手动添加：

```bash
# 编辑 root 的 crontab
crontab -e

# 添加这一行（每天凌晨 2 点检查续期，到期前 30 天内才会真正执行）
0 2 * * * certbot renew --quiet --deploy-hook "docker exec my-nginx nginx -s reload"
```

:::tip certbot renew 不会每次都申请新证书
`certbot renew` 内置保护机制，**只有证书剩余有效期少于 30 天时才会真正续期**，否则直接跳过什么都不做。每天定时执行相当于"每天检查一下，快到期才动手"，不会触发 Let's Encrypt 的频率限制（同域名每周最多申请 5 张）。
:::

添加后验证：

```bash
# 确认定时任务已写入
crontab -l

# 测试续期流程（不会真实申请证书，仅验证流程）
certbot renew --dry-run
```

输出 `All simulated renewals succeeded` 即配置正常，之后证书会全自动续期无需再管。

---

## 五、常见问题

**Q：申请时提示 `Connection refused` 或 `Timeout`**

80 端口未开放或防火墙拦截，检查：
```bash
# 查看防火墙状态
firewall-cmd --list-ports
# 开放 80 端口
firewall-cmd --permanent --add-port=80/tcp && firewall-cmd --reload
```

**Q：证书申请成功但浏览器仍提示不安全**

可能使用了 `cert.pem` 而不是 `fullchain.pem`，nginx 配置的 `ssl_certificate` 必须用 `fullchain.pem`（含完整证书链）。

**Q：Docker 容器内读取证书失败**

软链接问题，挂载整个 `/etc/letsencrypt` 目录而不是 `live/` 子目录，详见[上方说明](#_2-申请证书)。

**Q：查看证书到期时间**

```bash
certbot certificates
# 或
openssl x509 -noout -dates -in /etc/letsencrypt/live/your-domain.com/cert.pem
```
