import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
length = len(input)
f.close()

memSum = 0
strSum = 0
for x in input:
    strSum += len(x)
    i = 1
    while i < len(x) - 1:
        sliced = x[i:i + 2]
        print(sliced)
        if sliced == '\\"' or sliced == '\\\\':
            i += 1
        elif sliced == '\\x':
            i += 3
        memSum += 1
        i += 1
print(strSum)
print(memSum)
print(strSum - memSum)
    