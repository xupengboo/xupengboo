---
title: Rancher 证书轮换
order: 21
---

**起因**：2.5.14版本的 Rancher 默认证书日期是1年，时间超过一年后，可能会出现以下问题：

```shell
[root@env-002 ~]# kubectl get nodes
Unable to connect to the server: x509: certificate has expired or is not yet valid: current time 2025-07-28T14:13:45+08:00 is after 2025-07-25T08:32:16Z
```

 ![image-20250728143814303](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250728143814303.png)

**原因**：Kubernetes 集群的证书已过期（默认有效期为一年），导致 `kubectl` 无法连接 API Server。

**解决措施**：

- 参考官方地址：[https://docs.rancher.cn/docs/rancher2.5/trending-topics/certificate-rotation/_index/](https://docs.rancher.cn/docs/rancher2.5/trending-topics/certificate-rotation/_index/)

- Rancher 2.5.x 相关的解决方式如下：

```bash
# 1. 进入Rancher容器内部
docker exec -it 容器Id bash
# 2. 删除 Kubernetes Secret 注意：此操作会强制删除旧证书，可能导致短暂服务中断。
kubectl --insecure-skip-tls-verify -n kube-system delete secrets k3s-serving
kubectl --insecure-skip-tls-verify delete secret serving-cert -n cattle-system
# 3. 删除动态证书文件，删除后，K3s 会重新生成新的证书并写入该文件。
rm -f /var/lib/rancher/k3s/server/tls/dynamic-cert.json
# 4. 触发证书更新，通过访问 Rancher API 接口 /v3，强制触发证书更新流程。 
curl --insecure -sfL https://<访问Rancher的路径地址(IP:端口号)>/v3
exit

# 5. 重启容器
docker restart 容器Id
```



