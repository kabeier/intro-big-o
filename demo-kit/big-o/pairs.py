def count_pairs(items):
    steps = 0
    for a in items:
        for b in items:
            steps += 1
    return steps

for n in [10, 100, 1000]:
    items = list(range(n))
    print(n, count_pairs(items))
