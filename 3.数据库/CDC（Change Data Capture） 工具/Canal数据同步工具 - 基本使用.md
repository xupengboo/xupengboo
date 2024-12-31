# 1. Canal 全量同步 和 增量同步

Canal 初次启动时会执行 **全量同步**，然后进入 **增量同步** 模式，实时同步数据变更。

```properties
# 指定同步模式为 auto，这样首次会进行全量同步，之后会切换为增量同步
canal.instance.mode=auto
# 启动时执行全量同步
canal.instance.snapshooting=true
# 配置内存缓存大小
canal.instance.memory.buffer.size=1024
```

