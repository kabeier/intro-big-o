import math

calls = 0


def fib(n):
    global calls
    calls += 1
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

for n in [10, 20, 25]:
    calls = 0
    fib(n)
    print(n, calls)

for n in [3, 5, 10]:
    print(n, math.factorial(n))
