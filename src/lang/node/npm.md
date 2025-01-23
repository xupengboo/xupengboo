---
title: Npm 配置
order: 1
---

# Npm 配置

## 配置 npm  和 yarn 代理，解决超时问题

直接配置一个代理就行：

```bash
yarn config set proxy http://127.0.0.1:7890
yarn config set https-proxy https://127.0.0.1:7890

npm config set proxy http://127.0.0.1:7890
npm config set https-proxy https://127.0.0.1:7890
```

删除代理：
```bash
npm config delete proxy
npm config delete https-proxy
```

