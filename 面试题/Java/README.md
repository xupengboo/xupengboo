## Spring中 @Scheduled 的使用 以及 缺点

```java
package com.atguigu.gulimall.seckill.scheduled;

import com.atguigu.gulimall.seckill.service.SeckillService;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * 秒杀商品的定时上架：
 *    每天晚上3点；上架最近三天需要秒杀的商品。
 *    当天 00:00:00 - 23:59:59
 *    明天 00:00:00 - 23:59:59
 *    后天 00:00:00 - 23:59:59
 */
@Slf4j
@Service
public class SeckillSkuScheduled {

    @Autowired
    SeckillService seckillService;

    @Autowired
    RedissonClient redissonClient;

    public static final String UPLOAD_LOCK = "seckill:upload:lock";

    // TODO 幂等性处理
    @Scheduled(cron = "*/3 * * * * ?")
    public void uploadSeckillSkuLatest3Days(){
        // 1. 重复上架无需处理
        log.info("上架秒杀的商品信息...");
        // 分布式锁
        RLock lock = redissonClient.getLock(UPLOAD_LOCK);
        lock.lock(10, TimeUnit.SECONDS);
        try {
            seckillService.uploadSeckillSkuLatest3Days();
        } finally {
            lock.unlock();
        }
    }

}

```

@Scheduled 注解是 Spring 框架提供的一种定时任务调度的方式，可以用于在指定的时间点执行任务或者在固定的时间间隔执行任务。虽然 @Scheduled 注解在简化定时任务的开发和管理方面具有很大的优势，但也存在一些弊端：

1. **线程安全问题**：@Scheduled 注解默认是使用单线程执行定时任务的，如果任务执行时间过长，可能会影响后续任务的执行。此外，如果任务抛出了异常，可能会导致后续任务无法执行。
2. **依赖于 Spring 容器**：@Scheduled 注解依赖于 Spring 容器，如果 Spring 容器关闭或者重启，定时任务也会停止执行。
3. **不支持分布式环境**：@Scheduled 注解不支持在分布式环境中执行定时任务，如果应用部署在多个节点上，可能会导致任务重复执行或者执行错乱。
4. **不支持动态修改任务执行时间**：@Scheduled 注解不支持动态修改任务执行时间，如果需要修改任务执行时间，需要重新部署应用。
5. **不支持任务执行状态管理**：@Scheduled 注解不支持任务执行状态管理，无法方便地查看任务的执行情况和执行结果。
6. **不支持任务执行监控**：@Scheduled 注解不支持任务执行监控，无法方便地监控任务的执行情况和执行效率。