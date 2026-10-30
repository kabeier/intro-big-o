def binary_search(items, target):
    steps = 0
    left, right = 0, len(items) - 1
    while left <= right:
        steps += 1
        mid = (left + right) // 2
        if items[mid] == target:
            return steps
        elif target < items[mid]:
            right = mid - 1
        else:
            left = mid + 1
    return steps

for n in [10, 100, 1000, 1000000]:
    items = list(range(n))
    print(n, binary_search(items, n))
