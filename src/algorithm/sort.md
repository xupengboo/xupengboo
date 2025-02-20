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



### 6. 树结构查找

#### 6.1 二叉搜索树（BST，Binary Search Tree）

核心思想：左子树节点 < 根节点 < 右子树节点

时间复杂度：平均 O(log n)，最坏 O(n)（树退化为链表）。

优化：使用平衡树（如 AVL、红黑树）保持 O(log n) 时间复杂度。

:::tip

红黑树是一种平衡的二叉查找树，每个节点除了存储键值外，还会存储一个颜色属性（红色或黑色），并满足一定的红黑树性质。红黑树的关键特点是：从任意节点到其叶子节点的所有路径上，必须包含相同数目的黑色节点。

:::



#### 6.2 B树 / B+树

核心思想：多路平衡树，每个节点存储多个键，减少磁盘 I / O。

时间复杂度：O(log n)（层级少，适合大规模数据）。

适用场景：数据库索引、文件系统。

