# K8s devops 搭建

## 1. 构建Jenkins

初次部署，会经常遇到 Jenkins版本 和 插件版本 不兼容问题。

所以，一般而言，一开始便用最新版本的jenkins进行部署升级：

```yaml
image: jenkins/jenkins:lts-jdk21 # 或者 jenkins/jenkins:lts-jdk17
```

**`jenkins/jenkins:lts-jdk21` 不是一个固定版本，而是一个滚动标签（tag）**。每次官方发布新的 LTS，这个标签对应的镜像也会更新。

::: tip 企业环境一般怎么做呢？

- **通常不会直接使用：**

```yaml
image: jenkins/jenkins:lts-jdk21
```

**而是先查看当前 LTS 对应什么版本，然后固定下来。**

例如：

1. 先拉取：

```bash
docker pull jenkins/jenkins:lts-jdk21
```

2. 查看版本：

```bash
docker run --rm jenkins/jenkins:lts-jdk21 java -jar /usr/share/jenkins/jenkins.war --version
# 或者
kubectl exec jenkins-b98fbc9f4-blhw4 -n devops-tools -- bash -c 'echo $JENKINS_VERSION'
```

3. 输出：

```bash
2.516.1
```

4. 然后把 Deployment 改成：

```yaml
image: jenkins/jenkins:2.516.1-lts-jdk21
```

以后永远都是这个版本。

:::

