# Helm 基础使用



::: tip Helm n-3 向下兼容规则

Helm 3 和 Helm 4 都严格遵循 **`n-3`向下兼容原则 **：

1. 每个 Helm 版本在发布时会基于某个特定的 Kubernetes 小版本编译
2. 它将支持该 Kubernetes 版本以及 **之前的 3 个小版本** 
3. **不支持向前兼容**：即不推荐使用比 Helm 编译版本更新的 Kubernetes 集群

例如：

- Helm 3.9.4 是基于 Kubernetes 1.24 编译的，因此支持 1.24.x、1.23.x、1.22.x、1.21.x
- Helm 4.1.x 是基于 Kubernetes 1.35 编译的，因此支持 1.35.x 到 1.32.x
- 具体见：[官方地址](https://helm.sh/zh/docs/v3/topics/version_skew)

::: 



```shell
# 以 helm 3.9.4 、 k8s 1.21.5 、 ingress-nginx Chart 4.0.19 为例：

# 1. 安装 Helm 
curl -LO https://get.helm.sh/helm-v3.9.4-linux-amd64.tar.gz
tar -zxvf helm-v3.9.4-linux-amd64.tar.gz
sudo mv linux-amd64/helm /usr/local/bin/helm
helm version

# 2. 添加仓库镜像
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# 3. 更新
helm repo update

# 4. 查询对应版本
helm search repo ingress-nginx/ingress-nginx --versions | grep 4.0.19

# 5. 拉去对应版本
helm pull ingress-nginx/ingress-nginx --version 4.0.19
```



倘若，helm 安装失败，可以再卸载重新安装：

```shell
# 1. 先卸载
helm uninstall ingress-nginx -n ingress-nginx
release "ingress-nginx" uninstalled
# 2. 删除角色
kubectl delete clusterrole ingress-nginx-admission --ignore-not-found
clusterrole.rbac.authorization.k8s.io "ingress-nginx-admission" deleted
# 3. 删除角色绑定
kubectl delete clusterrolebinding ingress-nginx-admission --ignore-not-found
clusterrolebinding.rbac.authorization.k8s.io "ingress-nginx-admission" deleted
# 4. 删除ns
kubectl delete ns ingress-nginx
namespace "ingress-nginx" deleted
```



