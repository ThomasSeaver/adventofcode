import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
length = len(input)
f.close()

num = 0
for x in input:
    y = list(map(int, x.split('x')))
    y.sort()
    num += y[0] * 2 + y[1] * 2 + y[0] * y[1] * y[2]
print(num)