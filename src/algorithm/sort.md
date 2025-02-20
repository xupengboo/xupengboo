---
title: 排序与搜索
order: 4
icon: material-symbols:search
---

## 一、排序算法

### 1. 冒泡排序（Bubble Sort）

核心思想：重复遍历数组，比较相邻元素，若顺序错误则交换，每次遍历将最大元素“冒泡”到末尾。

时间复杂度：平均 O(n²)，最佳情况（已排序）O(n)。

适用场景：小规模数据或教学演示。

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(0, n):
        swapped = False
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

arr = [123,23,344,66,8,9,1,2,3,4,5,6]
print(bubble_sort(arr))
```

### 2. 选择排序（Selection Sort）

核心思想：每次从待排序的序列中选择最小元素，放到已排序部分的末尾。

时间复杂度：O(n²)（任何情况）。

适用场景：小规模数据或内存受限场景。

```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_Idx = i 
        for j in range(i + 1, n):
            if arr[j] < arr[min_Idx]:
                min_Idx = j
        arr[i], arr[min_Idx] = arr[min_Idx], arr[i]
    return arr

arr = [123,23,344,66,8,9,1,2,3,4,5,6]
print(selection_sort(arr))
```

### 3. 插入排序（Insertion Sort）

核心思想：将未排序元素逐个插入到已排序部分的正确位置。

时间复杂度：平均 O(n²) ，最佳情况（已排序）O(n)。

适用场景：小规模数据或基本有序数据。

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        # 从前面部分开始排序
        while j >= 0 and key < arr[j]:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    return arr

arr = [123,23,344,66,8,9,1,2,3,4,5,6]
print(insertion_sort(arr))
```

### 4. 快速排序（Quick Sort）

核心思想：分治法。选择一个**基准元素**，将数组分为“小于基准”和“大于基准”两部分，递归排序子数组。

时间复杂度：平均 O(n log n)，最坏 O(n²)（基准选择不当）。

适用场景：大规模数据，**实际应用最广泛**。

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2] # “ // ” 整数除法
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

arr = [123,23,344,66,8,9,1,2,3,4,5,6]
print(quick_sort(arr))
```

### 5. 归并排序（Merge Sort）

核心思想：**分治法。将数组分成两半，分别排序后合并**。

时间复杂度：稳定 O(n log n)。

适用场景：需要稳定排序或外部排序（如大文件排序）

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

# 核心逻辑：多重子递归 + merge合并
def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result += left[i:]
    result += right[j:]
    return result

arr = [123,23,344,66,8,9,1,2,3,4,5,6]
print(merge_sort(arr))
```

### 6. 堆排序（Heap Sort）

核心思想：**将数组构建为最大堆，依次取出堆顶元素（最大值）并调整堆**。

时间复杂度：O(n log n)。

适用场景：需要原地排序或优先队列相关操作。

```python
def heap_sort(arr):
    def heapify(arr, n, i):
        largest = i
        left = 2*i + 1
        right = 2*i + 2
        if left < n and arr[left] > arr[largest]:
            largest = left
        if right < n and arr[right] > arr[largest]:
            largest = right
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            heapify(arr, n, largest)
    
    n = len(arr)
    # 构建最大堆
    for i in range(n//2 -1, -1, -1):
        heapify(arr, n, i)
    # 依次取出堆顶元素
    for i in range(n-1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

arr = [123,23,344,66,8,9,1,2,3,4,5,6]
print(heap_sort(arr))
```



## **二、搜索算法**

### 1. 二分查找（Binary Search）

核心思想：**仅适用于有序数组。每次比较中间元素，缩小搜索范文至左半部分或右半部分**。

时间复杂度：O(log n)。

适用场景：有序数据的快速查找。

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

arr = [1,2,3,4,5,6,7,8,9,11]
print(binary_search(arr, 1))        
```

### 2. 线性搜索（Linear Search）

核心思想：**逐个遍历元素，知道找到目标值，适合小规模无法预知结构的列表**。

时间复杂度：O(n)。

适用场景：无序小规模数据或无法预知结构的列表。

```python
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1
```

### 3. 哈希表查找（Hash Table Lookup）

核心思想：通过哈希函数将键映射到存储位置，直接访问。

时间复杂度：平均 O(1)，最坏 O(n)（哈希冲突时）。

适用场景：快速查找键值对（如数据库索引、缓存）。

```python
# 例如：Python的字典，Java的HashMap
a = {
    "key" : "123"
}
```

### 4. 插值查找（Interpolation Search）

核心思想：基于数据分布均匀的假设，通过 `插值公式` 预测目标位置。

公式：`mid = low + (target - arr[low]) * (high - low) // (arr[high] - arr[low])` 

时间复杂度：平均 O(log log n)（均匀分布数据），最坏 O(n)。

适用场景：有序且**均匀分布**的数据（如电话号码、温度记录）。

```python
def interpolation_search(arr, target):
    low, high = 0, len(arr)-1
    while low <= high and arr[low] <= target <= arr[high]:
        mid = low + (target - arr[low]) * (high - low) // (arr[high] - arr[low])
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

arr = [1,2,3,4,5,6,7,8,9,11]
print(interpolation_search(arr, 11))  
```

### 5. 斐波那契查找（Fibonacci Search）

核心思想：利用斐波那契数列分割有序数组，减少比较次数。

- **黄金分割原理**：斐波那契数列的相邻数比接近黄金分割比例（≈ 0.618），利用这一特性分割数组。
- **动态调整区间**：通过斐波那契数确定分割点，逐步缩小搜索范围。

时间复杂度：O(log n)。

适用场景：有序数组，适合内存访问成本较高的环境（如外部存储）。

> 相比二分查找，分割点选择更接近黄金比例。

:::tip 斐波那契

斐波那契数列定义：

```text
F(0) = 0, F(1) = 1,  
F(n) = F(n-1) + F(n-2) (n ≥ 2)
```

:::

```python
def fibonacci_search(arr, target):
    n = len(arr)
    
    # 生成斐波那契数列，找到 F(k) ≥ n
    fib_m2 = 0  # F(k-2)
    fib_m1 = 1  # F(k-1)
    fib = fib_m1 + fib_m2  # F(k)
    while fib < n:
        fib_m2 = fib_m1
        fib_m1 = fib
        fib = fib_m1 + fib_m2
    
    low = 0
    high = fib_m1 - 1  # 扩展后的数组长度为 F(k)
    offset = -1
    
    # 扩展数组（填充尾部）
    while len(arr) < fib:
        arr.append(arr[-1])
    
    while fib > 1:
        mid = min(low + fib_m2 -1, high)
        
        if target < arr[mid]:
            # 向左半部分查找
            high = mid - 1
            fib = fib_m2
            fib_m1 = fib_m1 - fib_m2
            fib_m2 = fib - fib_m1
        elif target > arr[mid]:
            # 向右半部分查找
            low = mid + 1
            fib = fib_m1
            fib_m1 = fib_m2
            fib_m2 = fib - fib_m1
        else:
            # 找到目标，检查是否为填充值
            return mid if mid < n else n-1
    
    # 检查最后一个元素
    if fib_m1 and arr[low] == target:
        return low
    return -1

arr = [1,2,3,4,5,6,7,8,9,11]
print(fibonacci_search(arr, 9))        
```

### 6. 树结构查找

:::tip 什么是二叉树？

二叉树（Binary Tree）是一种树形数据结构，它的特点是每个节点最多有两个子节点，通常被称为 **左子节点** 和 **右子节点**。

:::

#### 6.1 二叉搜索树（BST，Binary Search Tree）

定义：二叉搜索树是一种有序的二叉树，其每个节点的左子树所有节点的值都小于该节点的值，右子树所有节点的值都大于该节点的值。

核心思想：左子树节点 < 根节点 < 右子树节点

时间复杂度：平均 O(log n)，最坏 O(n)（树退化为链表）。

优化：使用平衡树（如 AVL、红黑树）保持 O(log n) 时间复杂度。

```python
class TreeNode:

    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
    
class BST:

    def __init__(self):
        self.root = None
    
    def insert(self, val):
        """插入节点"""
        if not self.root:
            self.root = TreeNode(val)
        else:
            self._insert_recursive(self.root, key)
    
    def _insert_recursive(self, node, key):
        if key < node.key:
            if node.left is None:
                node.left = TreeNode(key)
            else:
                self._insert_recursive(node.left, key)
        else:
            if node.right is None:
                node.right = TreeNode(key)
            else:
                self._insert_recursive(node.right, key)

    def search(self, key):
        """查找节点"""
        return self._search_recursive(self.root, key)

    def _search_recursive(self, node, key):
        if node is None: 
            return False
        if key == node.key:
            return True
        elif key < node.key:
            return self._search_recursive(node.left, key)
        else:
            return self._search_recursive(node.right, key)
    
    def inorder_traversal(self):
        """中序遍历（返回有序序列）"""
        result = []
        self._inorder_recursive(self.root, result)
        return result
    
    def _inorder_recursive(self, node, result):
        if node:
            self._inorder_recursive(node.left, result)
            result.append(node.key)
            self._inorder_recursive(node.right, result)

# 测试
bst = BST()
keys = [5, 3, 7, 2, 4, 6, 8]
for key in keys:
    bst.insert(key)
print("BST中序遍历:", bst.inorder_traversal())  # 输出: [2, 3, 4, 5, 6, 7, 8]
print("查找 6:", bst.search(6))  # 输出: True
print("查找 9:", bst.search(9))  # 输出: False
```



#### 6.2 B树 / B+树

核心思想：多路平衡树，每个节点存储多个键，减少磁盘 I / O。

时间复杂度：O(log n)（层级少，适合大规模数据）。

适用场景：

- **B树适用**：MongoDB文档存储（需快速就地更新）
- **B+树适用**：MySQL InnoDB索引（需高效范围扫描）

:::tip 什么是多路平衡查找树？

B 树和 B+ 树都是多路平衡查找树。

**多路平衡查找树（Multi-way Balanced Search Tree）** 是一种树形数据结构，它扩展了二叉查找树的概念，使得每个节点可以有多个子节点，并且仍然保持平衡，以确保在查找、插入和删除操作时能够保持高效的时间复杂度。

**阶数（m）** 指的是树中每个节点最多可以有多少个子节点。

对于一个阶数为 **m** 的多路平衡查找树：

- 每个节点最多可以有 **m 个子节点**。
- 每个节点最多可以存储 **m - 1 个关键字**。

假设我们有一个 **阶数为 4** 的树（即 m = 4）：

- 每个节点最多可以有 **4 个子节点**。
- 每个节点最多可以存储 **3 个关键字**。

假设我们插入以下元素：`10, 20, 5, 15, 25, 30, 35`。

在阶数为 4 的多路平衡查找树中，树可能会长成这样：

```less
            [10, 20, 30]
           /    |    |    \
       [5]   [15]  [25]  [35]
```

:::

B 树与 B+ 树的区别：

| **特征**         | **B树**                          | **B+树**                             |
| ---------------- | -------------------------------- | ------------------------------------ |
| **数据存储位置** | 所有节点均可存储数据             | 仅叶子节点存储完整数据               |
| **键值冗余**     | 无冗余（键值唯一存在于一个节点） | 内部节点键值冗余（在叶子层重复出现） |
| **叶子结构**     | 独立分散的叶子节点               | 叶子节点通过双向链表串联             |



### 7. 跳表查询（Skip List）

核心思想：通过多层链表索引加速查找，类似二分查找的分层思想。

时间复杂度：O(log n)。

适用场景：实现简单，支持范围查询。替代平衡树（如 Redis 的有序集合）。

```python
import random

class Node:
    def __init__(self, value, level):
        self.value = value  # 节点值
        self.forward = [None] * (level + 1)  # 前进指针，长度为当前节点层数

class SkipList:
    def __init__(self, max_level=16):
        self.max_level = max_level  # 跳表的最大层数
        self.level = 0  # 当前跳表的层数
        self.header = Node(None, self.max_level)  # 跳表的头节点
        self.header.forward[0] = None  # 初始化底层链表为空

    def random_level(self):
        level = 0
        while random.random() < 0.5 and level < self.max_level:
            level += 1
        return level

    def insert(self, value):
        update = [None] * (self.max_level + 1)  # 用于记录每一层的前驱节点
        current = self.header

        # 从跳表的最高层开始向下查找
        for i in range(self.level, -1, -1):
            while current.forward[i] and current.forward[i].value < value:
                current = current.forward[i]
            update[i] = current

        # 跳表中是否已经存在该值
        current = current.forward[0]
        if current and current.value == value:
            return  # 如果存在该值，则不插入

        # 随机生成新节点的层数
        new_level = self.random_level()

        # 如果新节点的层数大于当前跳表的层数，则增加跳表的层数
        if new_level > self.level:
            for i in range(self.level + 1, new_level + 1):
                update[i] = self.header
            self.level = new_level

        # 创建新节点
        new_node = Node(value, new_level)

        # 更新各层的前进指针
        for i in range(new_level + 1):
            new_node.forward[i] = update[i].forward[i]
            update[i].forward[i] = new_node

    def search(self, value):
        current = self.header
        for i in range(self.level, -1, -1):
            while current.forward[i] and current.forward[i].value < value:
                current = current.forward[i]
        current = current.forward[0]
        if current and current.value == value:
            return current
        return None

    def delete(self, value):
        update = [None] * (self.max_level + 1)
        current = self.header

        # 从跳表的最高层开始向下查找
        for i in range(self.level, -1, -1):
            while current.forward[i] and current.forward[i].value < value:
                current = current.forward[i]
            update[i] = current

        current = current.forward[0]
        if current and current.value == value:
            # 删除节点
            for i in range(self.level + 1):
                if update[i].forward[i] != current:
                    break
                update[i].forward[i] = current.forward[i]
            # 更新跳表的层数
            while self.level > 0 and self.header.forward[self.level] is None:
                self.level -= 1

    def display(self):
        for i in range(self.level, -1, -1):
            current = self.header.forward[i]
            print(f"Level {i}: ", end="")
            while current:
                print(current.value, end=" -> ")
                current = current.forward[i]
            print("None")

# 使用示例
skip_list = SkipList()

# 插入数据
skip_list.insert(3)
skip_list.insert(6)
skip_list.insert(7)
skip_list.insert(9)
skip_list.insert(12)

# 查找数据
result = skip_list.search(7)
print("Found:", result.value if result else "Not found")

# 删除数据
skip_list.delete(6)

# 显示跳表
skip_list.display()
```

### 8. 广度优先搜索（BFS） 与 深度优先搜索（DFS）

BFS（Breadth-First Search，广度优先搜索）是按照节点的“层次”逐层搜索，即先访问离起点最近的节点，再逐渐访问远离起点的节点。

DFS（Depth-First Search，深度优先搜索）则是沿着一个路径尽可能深入，直到不能继续，再回溯到上一个节点，继续深入其他路径。





### 9. 布隆过滤器（Bloom Filter）





### 10. 三分搜索（Ternary Search）



