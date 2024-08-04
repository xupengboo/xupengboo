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

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1722749163202-15c85d35-b5e1-4a0f-a2c2-02c421b4c1a5.png#averageHue=%23fefdfd&clientId=u0ee5922e-0baf-4&from=paste&height=279&id=u2106db3d&originHeight=1117&originWidth=1551&originalType=binary&ratio=1&rotation=0&showTitle=false&size=114476&status=done&style=none&taskId=u68053ed1-f4d1-4d9a-8d57-86e210235cc&title=&width=388)![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1722749190054-4cd641fc-2acc-4201-a09b-12d43f34c0b2.png#averageHue=%238cbf42&clientId=u0ee5922e-0baf-4&from=paste&height=279&id=u38abd7ec&originHeight=971&originWidth=1093&originalType=binary&ratio=1&rotation=0&showTitle=false&size=63371&status=done&style=none&taskId=ua0890ea1-e083-4394-b087-09181b42eb7&title=&width=314)

2. 直接根据页面操作
- 添加集群 =》 选择集群类型（一般 自定义） =》 填写集群相关信息，下一步，执行每个节点要对应的相关命令即可。
3. 等待创建，时间很长。
> 💡Tips：如果有爆红的提示，可以暂时不用管，会自动消除。

## 4. 如何在Rancher某个k8s集群中，部署一个服务？

1. 进入项目。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1722749821934-2f1ca085-c9ee-42e9-b08d-b95a0d533ce1.png#averageHue=%23e0e3d4&clientId=u0ee5922e-0baf-4&from=paste&height=761&id=u168cfc17&originHeight=761&originWidth=1583&originalType=binary&ratio=1&rotation=0&showTitle=false&size=114999&status=done&style=none&taskId=ue68f8b74-0e29-49b7-9cd6-0a2c3798241&title=&width=1583)
> 💡Tips：项目 是 Rancher独有的，并不是属于k8s相关的。

2. 点击 部署服务。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1722749896030-9ac9658b-6887-4d9e-9cb0-e76b33b674fb.png#averageHue=%23e2c460&clientId=u0ee5922e-0baf-4&from=paste&height=915&id=u6511a4aa&originHeight=915&originWidth=2655&originalType=binary&ratio=1&rotation=0&showTitle=false&size=146890&status=done&style=none&taskId=u854baf8a-53e6-4fe6-8dae-d6c376a27a2&title=&width=2655)

3. 配置服务相关信息（跟 docker 那些参数一毛一样的，什么环境变量、端口映射、容器卷、缩放策略 等等）

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1722749990963-88a579ec-cce4-4b0f-93f3-c7d339391b5b.png#averageHue=%23fefefe&clientId=u0ee5922e-0baf-4&from=paste&height=1189&id=uc3a5554e&originHeight=1189&originWidth=2703&originalType=binary&ratio=1&rotation=0&showTitle=false&size=160000&status=done&style=none&taskId=u74a94c77-f673-4ad4-8364-3ac39582d1d&title=&width=2703)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1722750102545-937200d3-36a5-4bcf-9764-f8bf20662bc8.png#averageHue=%23e6d585&clientId=u0ee5922e-0baf-4&from=paste&height=1429&id=ub91cac9b&originHeight=1429&originWidth=2701&originalType=binary&ratio=1&rotation=0&showTitle=false&size=262066&status=done&style=none&taskId=u13dd5098-9bec-4681-bd57-00c789a4f64&title=&width=2701)
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

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1722753015519-f93ecef3-6a50-49c1-8935-7d6edb4b7207.png#averageHue=%23e3bb6b&clientId=u0ee5922e-0baf-4&from=paste&height=635&id=u9fe5662d&originHeight=635&originWidth=1453&originalType=binary&ratio=1&rotation=0&showTitle=false&size=85537&status=done&style=none&taskId=ue58569e0-7d51-48e4-b0ef-d62f630628b&title=&width=1453)

3. 在安装好kubectl的机器上，配置kubeconfig，将复制的文件内容全部保存在config文件中
```shell
mkdir ~/.kube
vim ~/.kube/config
```
> 💡Tips：其实，这些步骤，在rancher中，也是有向导的。也明确告诉了，安装kubectl和将配置文件，配置到何处。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1722753406996-cfad9c28-abf3-49ae-9cc7-1fb06410562b.png#averageHue=%232b2c24&clientId=u0ee5922e-0baf-4&from=paste&height=1233&id=uce8348e4&originHeight=1233&originWidth=2385&originalType=binary&ratio=1&rotation=0&showTitle=false&size=425262&status=done&style=none&taskId=ueed4b6e7-8eaa-4ecb-913b-2c5c728e187&title=&width=2385)

4. 这样就安装好了，执行命令测试即可。
```shell
kubectl get pods
```
## 6. Rancher 宕机了 怎么办？
如果 Rancher 服务宕机，Kubernetes 集群环境不会受到影响。在这种情况下，需要通过 **命令行** 来调整整个环境。  
还是对应上面先安装 kubectl 那些操作，之后通过命令形式，去管理k8s或者rancher相关信息。


