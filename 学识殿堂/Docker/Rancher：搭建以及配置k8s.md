## 1. 前提条件
前提条件：

- 安装docker，要求版本各节点版本一致。
- 网上还有额外的要求：关闭swap、禁用selinux等等。
## 2. 搭建 Rancher 服务
直接通过docker命令实现即可，很方便。
```shell
docker run -d \
  --name rancher \
  --restart unless-stopped \
  --privileged \
  -v /opt/mount/rancher/lib/kubelet:/var/lib/kubelet \
  -v /opt/mount/rancher/lib/rancher:/var/lib/rancher \
  -v /opt/mount/rancher/log:/var/log \
  -v /opt/mount/rancher/lib/cni:/var/lib/cni \
  -p 1443:443 \
  --security-opt label=disable \
  --shm-size 64m \
  rancher/rancher:v2.5.14
```
## 3. 如何使用rancher搭建多个k8s集群？

1. 英文不友好的同志，直接切换简体中文就行（喜欢强迫自己看英文的，推荐：先中文熟悉几遍，之后再切换回英文，不然容易自闭）。
![image](https://github.com/user-attachments/assets/fe75ab50-c8c1-4679-ae34-e32a164b4913)

2. 直接根据页面操作
- 添加集群 =》 选择集群类型（一般 自定义） =》 填写集群相关信息，下一步，执行每个节点要对应的相关命令即可。
3. 等待创建，时间很长。
> 💡Tips：如果有爆红的提示，可以暂时不用管，会自动消除。

## 4. 如何在Rancher某个k8s集群中，部署一个服务？

1. 进入项目。

![image (1)](https://github.com/user-attachments/assets/097b47a1-2065-4e00-8fdc-d1a73ab013be)
> 💡Tips：项目 是 Rancher独有的，并不是属于k8s相关的。

2. 点击 部署服务。

![image (2)](https://github.com/user-attachments/assets/8ab67a5d-aedf-4ea0-89bd-81d70e3859bb)


3. 配置服务相关信息（跟 docker 那些参数一毛一样的，什么环境变量、端口映射、容器卷、缩放策略 等等）

![image (3)](https://github.com/user-attachments/assets/8b8b9088-ed61-4890-95b1-2ab650138427)

## 5. 安装了Rancher了，如何在宿主机上面安装 kubectl 命令？
**Rancher部署成功后，执行kubectl命令只能在控制台执行，无法再宿主机直接执行，很不方便**。
就需要给宿主机安装 kubectl 命令：

1. [在 Linux 系统中安装并设置 kubectl](https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-linux/) 根据官方操作即可（也可以去github下载release）。
- 有一个坑，那就是版本对应，最好是跟rancher搭建集群的版本一致，去rancher平台执行kubectl version能获取到kubectl的版本。
```shell
# 1. 下载指定版本的kubectl 
curl -LO https://dl.k8s.io/release/v1.19.7/bin/linux/amd64/kubectl
# 2. 验证该可执行文件
curl -LO "https://dl.k8s.io/release/v1.19.7/bin/linux/amd64/kubectl.sha256"
# 验证通过时，输出： kubectl: OK
# 3. 安装 kubectl
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
# 4. 安装成功，测试即可
kubectl version --client
```

2. 复制集群的kubeconfig文件
- `kubeconfig` 文件是 Kubernetes 用来配置访问 Kubernetes 集群的信息的文件。  

![image (4)](https://github.com/user-attachments/assets/65600033-cbad-4f0a-8cc5-d9a9be92fd60)

3. 在安装好kubectl的机器上，配置kubeconfig，将复制的文件内容全部保存在config文件中
```shell
mkdir ~/.kube
vim ~/.kube/config
```
> 💡Tips：其实，这些步骤，在rancher中，也是有向导的。也明确告诉了，安装kubectl和将配置文件，配置到何处。

![image (5)](https://github.com/user-attachments/assets/9f7be508-d7b5-4d60-a507-545c7d06fd83)

4. 这样就安装好了，执行命令测试即可。
```shell
kubectl get pods
```
## 6. Rancher 宕机了 怎么办？
如果 Rancher 服务宕机，Kubernetes 集群环境不会受到影响。在这种情况下，需要通过 **命令行** 来调整整个环境。  
还是对应上面先安装 kubectl 那些操作，之后通过命令形式，去管理k8s或者rancher相关信息。


