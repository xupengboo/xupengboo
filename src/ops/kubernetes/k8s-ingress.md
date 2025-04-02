---
title: Kubernetes Ingress 使用
order: 11
---

1. 创建 `ingress` ：

> 注意：`host` 必须是域名，所以，可以在本地和宿主机的 `hosts` 文件，配置 `node-01` 映射关系。

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  namespace: test-ns
spec:
  ingressClassName: nginx
  rules:
  - host: node-01
    http:
      paths:
      - backend:
          service:
            name: myapp-service
            port:
              number: 80
        path: /
        pathType: Prefix
```

2. 创建 `service` ：

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: myapp
  name: myapp-service
  namespace: test-ns
spec:
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: myapp
  sessionAffinity: None
  type: ClusterIP
```

3. 创建 `deployment`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: myapp
  name: myapp-deployment
  namespace: test-ns
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - env:
        - name: ENV_VAR
          value: example-value
        image: nginx:1.17
        name: my-container
        ports:
        - containerPort: 80
          protocol: TCP
        resources:
          limits:
            cpu: 500m
            memory: 128Mi
          requests:
            cpu: 250m
            memory: 64Mi
        volumeMounts:
        - mountPath: /data
          name: my-volume
      volumes:
      - emptyDir: {}
        name: my-volume
```

4. 测试访问，`Ingress` 地址 即可。



> TODO 需要检测本地机器是不是有一个叫做 nginx 的 ingress控制器。
