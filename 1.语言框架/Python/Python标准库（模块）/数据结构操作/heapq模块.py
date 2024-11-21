# heapq 提供堆排序功能。
import heapq 

# 最小堆
nums = [5, 2, 8, 1]
heapq.heapify(nums)
print(heapq.heappop(nums))