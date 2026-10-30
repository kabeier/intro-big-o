def get_first(items):
    return items[0]

def linear_search(items, target):
    steps = 0
    for item in items:
        steps += 1
        if item == target:
            return steps
    return steps

for n in [10, 100, 1000]:
    items = list(range(n))
    print(n, linear_search(items, n))
