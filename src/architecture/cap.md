---
title: CAP 分布式定理
order: 3
icon: fluent:text-align-distributed-20-filled
---

## 1. 什么是网络分区？

想要理解CAP定理，先理解什么是网络分区：

**网络分区（Network Partitioning）是指网络系统中某些节点之间的通信被中断，导致网络被划分为若干相互隔离的分区的情况**。这种情况通常发生在分布式系统或集群环境中，当网络链路故障、路由问题或其他原因导致节点无法相互通信时，系统中的部分节点会形成多个无法连接的子网络或分区。各个分区内的节点仍然可以相互通信，但分区之间的通信被切断。

**网络分区可以发生**在 **单集群** 或 **多集群** 环境中，原因可能是网络设备故障、物理线路中断或配置问题等。这种情况对分布式系统影响很大，特别是在需要高一致性和高可用性的系统中，需要做出特殊处理或设计以应对可能的分区情况。

## 2. CAP 的具体含义

CAP 定理又称布鲁尔定理，是分布式系统领域的一个重要理论。

1. **一致性（Consistency）**：在分布式系统中的所有数据备份，在同一时刻是否具有同样的值。即对某个指定的客户端来说，读操作能返回最新的写操作结果。比如在一个分布式数据库系统中，执行一个更新操作后，所有节点的数据应该立即同步，使得后续的读取操作都能得到更新后的值。
2. **可用性（Availability）**：在分布式系统中，任何非故障节点都应该在合理的时间内对客户端的请求作出响应，即服务一直可用。也就是说，即使部分节点出现故障，系统整体也应该能够继续处理请求，不会出现长时间的无法响应的情况。
3. **分区容错性（Partition tolerance）**：分布式系统在遇到网络分区的情况下，仍然能够正常对外提供服务。网络分区是指由于网络故障等原因，导致分布式系统中的节点之间的通信出现问题，被分成几个独立的区域，不同区域之间无法进行通信。

## 3. CAP 定理的结论

CAP 定理指出，一个分布式系统最多只能同时满足一致性、可用性和分区容错性这三个特性中的两个。这是因为在网络分区的情况下，要保证一致性，就可能需要等待所有节点的数据同步完成后才能响应请求，这就会影响可用性；而如果要保证可用性，就可能无法保证所有节点的数据完全一致。

:::info 总结

**Consistency（一致性）、 Availability（可用性）、Partition tolerance（分区容错性），最多只能同时三个特性中的两个，三者不可兼得。**

:::



## 4. 分布式系统的 CAP 定理的应用场景有哪些？

### 4.1 案例背景

假设我们有一个部署在同一数据中心内的分布式数据库集群，该集群内有多个节点负责处理客户端的读写请求，并在节点间复制数据以保证一致性。由于网络故障（比如某台交换机发生故障），导致集群被分为两个分区 A 和 B，分区内的节点能相互通信，但分区之间的通信中断。

### 4.2 面临的 CAP 决策

在网络分区的情况下，CAP 定理要求在一致性（C）和可用性（A）之间做出选择，因为分区容忍性（P）已经不可避免：

- **一致性（Consistency）**：即所有分区中的数据保持一致，确保每次请求访问的数据都是最新的、同步的。
- **可用性（Availability）**：每个分区仍然能够提供读写服务，即使在分区期间也能响应客户端请求。

### 4.3 决策示例

以一个分布式数据库（如 MongoDB、Cassandra）为例：

1. **选择一致性（C）而放弃可用性（A）**：
   - 在这种情况下，数据库集群可以选择拒绝写入分区 B 的请求，只允许分区 A 提供写入操作，确保所有写入操作都能维持数据的一致性。这样做的好处是数据不会出现不一致的情况，但坏处是分区 B 在网络恢复前将无法响应任何写请求，降低了系统的可用性。
   - 适用场景：对数据一致性要求极高的系统，比如金融系统中的银行账户系统，确保不因分区导致余额错误。
2. **选择可用性（A）而放弃一致性（C）**：
   - 在这种情况下，允许分区 A 和 B 继续各自提供读写服务，不管分区之间的中断。这样每个分区仍可响应客户端请求，但这可能导致写入数据在两个分区之间不同步，从而出现暂时的数据不一致。
   - 适用场景：对可用性要求更高的系统，比如社交媒体的评论系统，允许在短暂分区期间存在轻微数据不一致，但确保用户可以持续访问和操作。
3. **网络恢复后的数据同步**：
   - 无论选择一致性还是可用性，分区恢复后都需要进行数据同步或冲突解决。例如，系统可以通过“最后写入者胜出”或“合并策略”来解决不同分区间的数据冲突，保证最终一致性（Eventual Consistency）。

### 4.4 列举一个常见案例（主从复制）

#### 4.4.1 主从复制 `CP模式` （常见：关系型数据库）

**在 CP 模式下的主从复制**：当网络分区发生时，系统只允许主节点所在的分区继续提供服务，拒绝其他分区的写请求，以确保数据的一致性。比如在一些关系型数据库中，主从复制通常偏向于 CP 模式。

#### 4.4.2 主从复制 `AP模式`（常见：非关系型数据库）

**在 AP 模式下的主从复制**：一些分布式系统可以在主从复制下选择 AP 模式。比如在 NoSQL 系统（如 Cassandra）中，系统可以允许多个分区进行读写操作，并在网络恢复后进行数据同步，从而更关注可用性。

:::tip

**一般 `AP模式` ，放弃严格的一致性要求，采用最终一致性。这意味着在网络分区期间允许数据不一致，但在网络恢复后，通过数据同步机制保证数据最终一致。**

:::
