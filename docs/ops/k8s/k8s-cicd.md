# K8s devops 搭建

## 1. Jenkins 安装部署

### 1.1 Jenkins 镜像

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

### 1.2 Jenkins 部署

**以下基于 kubernetes 部署Jenkins：**

1. **`kubectl apply -f jenkins-01-serviceAccount.yaml`** 

```yaml
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: jenkins-admin
rules:
  - apiGroups: [""]
    resources: ["*"]
    verbs: ["*"]
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: jenkins-admin
  namespace: devops-tools
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: jenkins-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: jenkins-admin
subjects:
- kind: ServiceAccount
  name: jenkins-admin
  namespace: devops-tools
```

2. **`kubectl apply -f jenkins-02-volume.yaml`**

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Retain
allowVolumeExpansion: true
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: jenkins-pv-volume
  labels:
    type: local
spec:
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  claimRef:
    name: jenkins-pv-claim
    namespace: devops-tools
  capacity:
    storage: 50Gi
  accessModes:
    - ReadWriteOnce
  local:
    path: /var/lib/paascontainer/jenkins
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - kcs-yd-qk-zhaocai-k8s-test-s-djsr2
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: jenkins-pv-claim
  namespace: devops-tools
spec:
  storageClassName: local-storage
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 30Gi
```

3. **`kubectl apply -f jenkins-03-deployment.yaml`** 

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jenkins
  namespace: devops-tools
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jenkins-server
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: jenkins-server
    spec:
      securityContext:
            # Note: fsGroup may be customized for a bit of better
            # filesystem security on the shared host
            fsGroup: 1000
            runAsUser: 1000
            ### runAsGroup: 1000
      serviceAccountName: jenkins-admin
      containers:
        - name: jenkins
          image: jenkins/jenkins:lts-jdk21
          # OPTIONAL: check for new floating-tag LTS releases whenever the pod is restarted:
          imagePullPolicy: IfNotPresent
          resources:
            limits:
              memory: "2Gi"
              cpu: "1000m"
            requests:
              memory: "500Mi"
              cpu: "500m"
          ports:
            - name: httpport
              containerPort: 8080
            - name: jnlpport
              containerPort: 50000
          livenessProbe:
            httpGet:
              path: "/login"
              port: 8080
            initialDelaySeconds: 90
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 5
          readinessProbe:
            httpGet:
              path: "/login"
              port: 8080
            initialDelaySeconds: 60
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          volumeMounts:
            - name: jenkins-data
              mountPath: /var/jenkins_home
      volumes:
        - name: jenkins-data
          persistentVolumeClaim:
              claimName: jenkins-pv-claim
```

4. **`kubectl apply -f jenkins-04-service.yaml`**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: jenkins-service
  namespace: devops-tools
  annotations:
      prometheus.io/scrape: 'true'
      prometheus.io/path:   /
      prometheus.io/port:   '8080'
spec:
  selector:
    app: jenkins-server
  type: NodePort
  ports:
    - port: 8080
      targetPort: 8080
      nodePort: 32000
```

## 2. Jenkins 安装插件

```shell
Pipeline
Git Plugin
Credentials Plugin
Docker Pipeline
Kubernetes Plugin
Blue Ocean
```

## 3. Jenkins CI/CD流程

1. **基于 Kubernetes Native 的 CI/CD 构建：**

```bash
# 阶段逻辑：
初始化阶段 -> built-in
编译阶段 -> K8S Pod
构建阶段 -> K8S Pod
部署阶段 -> K8S Pod

# 例如：
Git Pod
↓
Maven Pod
↓
Kaniko Pod
↓
Kubectl Pod
```

2. **`Pipeline script from SCM` 的 `Jenkinsfile` 脚本：**

```groovy
pipeline {

    agent any

    environment {
        // 镜像仓库公共配置
        HARBOR_CREDS = credentials('jenkins-cmecloud-creds')
        HARBOR_HOST = "xupengboo-xxx-私仓地址.cn"
        HARBOR_LIB  = "xxx-lib"

        // K8s 部署公共配置
        NAMESPACE   = "procure"
        LIVE_DELAY  = "180"
        READY_DELAY = "60"

        // JVM 与资源配置
        JAVA_OPTS   = "-XX:+UseG1GC -Xms2048m -Xmx4096m -Dfile.encoding=UTF-8"
        REQUESTS_CPU = "10m"
        REQUESTS_MEM = "512Mi"
        LIMIT_CPU   = "1"
        LIMIT_MEM   = "5Gi"

        // 代码仓库配置
        PROJECT_URL = "http://xxx:8080/xupengboo-digital-center//xupengboo.git"
        PROJECT_BRANCH = "test"
    }

    parameters {
        choice(
            description: '选择待发布的应用',
            name: 'APP_NAME',  // APP_NAME 是 对应的项目的应用名称， 多个项目可以通过这个实现。
            choices: [
                'xupengboo-demo',
            ]
        )
        choice(
            description: '选择运行环境',
            name: 'SPRING_PROFILE',
            choices: ['test']
        )
        string(
            description: '指定镜像版本发布（不填则正常拉取代码构建）',
            name: 'INPUT_IMAGE_TAG',
            defaultValue: ''
        )
        string(
            description: '副本数量',
            name: 'REPLICAS',
            defaultValue: '2'
        )
    }

    stages {
        stage('初始化配置') {
            agent any
            steps {
                script {

                    def appConfig = [
                        'xupengboo-demo': [
                            module: 'xupengboo-demo',    // Maven 模块名
                            port: '8100',                // 服务端口
                            clusters: ['procure']        // 需部署的集群列表
                        ]
                    ]

                    // 集群凭据配置：每个集群对应独立的kubeconfig凭据ID，敏感信息统一管理
                    def clusterConfig = [
                        'procure':    [kubeconfigId: 'jenkins-k8s-config'],
                    ]

                    // 配置合法性校验
                    if (!appConfig.containsKey(params.APP_NAME)) {
                        error("未找到应用 [${params.APP_NAME}] 的配置，请检查参数")
                    }

                    env.APP_NAME     = params.APP_NAME
                    env.MODULE_LOC   = appConfig[params.APP_NAME].module
                    env.PORT         = appConfig[params.APP_NAME].port
                    env.CLUSTER_LIST = appConfig[params.APP_NAME].clusters.join(',')

                    // 提前处理指定版本的场景
                    if (params.INPUT_IMAGE_TAG) {
                        env.TAG = params.INPUT_IMAGE_TAG
                    }

                    // 打印发布信息
                    echo "========================================"
                    echo "应用: ${env.APP_NAME}  模块: ${env.MODULE_LOC}  端口: ${env.PORT}"
                    echo "部署集群: ${env.CLUSTER_LIST}"
                    echo "环境: ${params.SPRING_PROFILE}  副本: ${params.REPLICAS}"
                    echo "镜像Tag: ${env.TAG ?: '构建后自动生成'}"
                    echo "镜像仓库: ${env.HARBOR_HOST}/${env.HARBOR_LIB}"
                    echo "========================================"
                }
            }
        }

        stage('代码拉取&编译') {
            when {
                expression { params.INPUT_IMAGE_TAG == '' }
            }

            agent {
                kubernetes {
                    cloud 'kubernetes'
                    yaml '''
                        apiVersion: v1
                        kind: Pod
                        spec:
                          containers:
                          - name: git
                            image: bitnami/git:2.40.0
                            command:
                            - cat
                            tty: true
                          - name: maven
                            image: maven:3.9.16-eclipse-temurin-17-alpine
                            command:
                            - cat
                            tty: true
                        '''
                }
            }
            steps {
                dir('./source') {
                    container('git') {
                        sh "git config --global --add safe.directory '*'"
                        git(
                            url: env.PROJECT_URL,
                            branch: env.PROJECT_BRANCH,
                            credentialsId: "cicd-gitlab",
                            changelog: true
                        )
                        script {
                            def buildTime = sh(script: 'date +%Y%m%d%H%M', returnStdout: true).trim()
                            def gitCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                            env.GIT_TAG = "${buildTime}-${gitCommit}"
                            env.TAG = env.GIT_TAG
                        }
                        echo "生成镜像版本号: ${env.GIT_TAG}"
                    }

                    container('maven') {
                        withCredentials([
                            file(credentialsId: 'maven-settings-k8s', variable: 'MAVEN_SETTINGS')
                        ]) {
                            sh "mvn clean package -pl ${env.MODULE_LOC} -am -Dmaven.test.skip=true -s ${MAVEN_SETTINGS}"
                        }
                    }

                    // 复制对应应用的 Dockerfile 到 source 目录，与构建产物一起打包
                    sh "cp -f ../xupengboo/${env.APP_NAME}/Dockerfile ./Dockerfile"

                    // 将构建产物和 Dockerfile 打包传给后续阶段（构建镜像阶段运行在不同 agent 上，workspace 不共享）
                    stash name: 'build-artifacts', includes: 'target/**,Dockerfile'
                }
            }
        }

        stage('构建镜像') {
            when {
                expression { params.INPUT_IMAGE_TAG == '' }
            }

            agent {
                kubernetes {
                    cloud 'kubernetes'
                    yaml """
                        apiVersion: v1
                        kind: Pod
                        spec:
                          containers:
                          - name: kaniko
                            image: gcr.io/kaniko-project/executor:v1.23.2-debug
                            command:
                            - /busybox/cat
                            tty: true
                        """
                }
            }

            steps {
                script {

                    unstash 'build-artifacts'

                    sh '''
                    mkdir -p source/target
                    mv target/* source/target/
                    mv Dockerfile source/
                    '''

                    withCredentials([
                        usernamePassword(
                            credentialsId: 'jenkins-cmecloud-creds',
                            usernameVariable: 'HARBOR_USER',
                            passwordVariable: 'HARBOR_PASS'
                        )
                    ]) {

                        container('kaniko') {

                            sh """
                            mkdir -p /kaniko/.docker
                            cat > /kaniko/.docker/config.json << 'EOF'
{"auths":{"${HARBOR_HOST}":{"username":"${HARBOR_USER}","password":"${HARBOR_PASS}"}}}
EOF
                            """

                            sh """
                            /kaniko/executor \
                              --context=${WORKSPACE}/source \
                              --dockerfile=${WORKSPACE}/source/Dockerfile \
                              --destination=${HARBOR_HOST}/${HARBOR_LIB}/${APP_NAME}:${TAG} \
                              --cache=true \
                              --cache-copy-layers=true \
                              --snapshot-mode=redo
                            """
                        }
                    }
                }
            }
        }

        stage('多集群并行部署') {

            agent {
                kubernetes {
                    cloud 'kubernetes'
                    yaml '''
                        apiVersion: v1
                        kind: Pod
                        spec:
                          containers:
                          - name: kubectl
                            image: lwolf/helm-kubectl-docker:v1.21.1-v3.6.0
                            command:
                            - cat
                            tty: true
                        '''
                }
            }

            steps {
                script {
                    def clusterKubeconfig = [
                        'procure': 'jenkins-k8s-config',
                    ]

                    def clusters = env.CLUSTER_LIST.split(',')
                    def deployStages = [:]

                    clusters.each { clusterName ->
                        deployStages["部署-${clusterName}集群"] = {
                            stage("部署-${clusterName}集群") {
                                container('kubectl') {
                                    withCredentials([
                                        string(
                                            credentialsId: clusterKubeconfig[clusterName],
                                            variable: 'KUBE_CONFIG_B64'
                                        )
                                    ]) {
                                        sh "mkdir -p ~/.kube"
                                        sh "echo '${KUBE_CONFIG_B64}' | base64 -d > ~/.kube/config"

                                        writeFile(
                                            file: "k8s-deployment-${clusterName}.yaml",
                                            text: """---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${env.APP_NAME}
  namespace: ${env.NAMESPACE}
  labels:
    app: ${env.APP_NAME}
spec:
  replicas: ${params.REPLICAS}
  selector:
    matchLabels:
      app: ${env.APP_NAME}
  template:
    metadata:
      labels:
        app: ${env.APP_NAME}
    spec:
      imagePullSecrets:
        - name: cmecloud-secret
      containers:
        - name: ${env.APP_NAME}
          image: ${env.HARBOR_HOST}/${env.HARBOR_LIB}/${env.APP_NAME}:${env.TAG}
          imagePullPolicy: Always
          ports:
            - containerPort: ${env.PORT}
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: ${params.SPRING_PROFILE}
            - name: JAVA_OPTS
              value: "${env.JAVA_OPTS}"
          resources:
            requests:
              cpu: ${env.REQUESTS_CPU}
              memory: ${env.REQUESTS_MEM}
            limits:
              cpu: ${env.LIMIT_CPU}
              memory: ${env.LIMIT_MEM}
""".stripIndent()
                                        )

                                        sh "cat k8s-deployment-${clusterName}.yaml"

                                        try {
                                            sh "kubectl apply -f k8s-deployment-${clusterName}.yaml"
                                            sh "kubectl rollout status -f k8s-deployment-${clusterName}.yaml --timeout=10m"
                                        } catch (Exception e) {
                                            echo "❌ ${clusterName}集群部署失败，自动回滚到上一版本"
                                            sh "kubectl rollout undo deployment/${env.APP_NAME} -n ${env.NAMESPACE} || true"
                                            throw e
                                        }
                                    }
                                }
                            }
                        }
                    }

                    parallel deployStages
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline 执行结束，最终状态: ${currentBuild.currentResult}"
        }

        success {
            echo "✅ 全部集群部署成功"
            echo "应用: ${env.APP_NAME} | 镜像: ${env.HARBOR_HOST}/${env.HARBOR_LIB}/${env.APP_NAME}:${env.TAG}"
        }

        failure {
            echo "❌ 发布失败，请查看控制台日志排查问题"
        }

        cleanup {
            node('built-in') {
                dir('./source') {
                    deleteDir()
                }
                deleteDir()
            }
        }
    }

}
```

3. **Jenkins 的相关凭证配置：**

![image-78aa87f17b73b4851cc6abe07629ac6f.png](/public/images/image-78aa87f17b73b4851cc6abe07629ac6f.png)

4. **上面脚本中，还要设置对应集群里面配置的密钥：**

```bash
kubectl create secret docker-registry cmecloud-secret \
  --docker-server=xupengboo-私仓地址-cloud.cn \
  --docker-username=admin \
  --docker-password=123456 \
  -n procure
```



