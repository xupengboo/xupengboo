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

核心思想：分治法。将数组分成两半，分别排序后合并。

时间复杂度：稳定 O(n log n)。

适用场景：需要稳定排序或外部排序（如大文件排序）

```python

```







## **二、搜索算法**

