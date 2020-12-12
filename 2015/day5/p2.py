import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
length = len(input)
f.close()

num = 0
for x in input:
    repeatSplit = False
    for y in range(1, len(x) - 1):
        if x[y - 1] == x[y + 1]:
            repeatSplit = True
            break
    repeatDouble = False
    for y in range(1, len(x) - 2):
        for z in range(y + 2, len(x)):
            if x[y - 1: y + 1] == x[z - 1: z + 1]:
                repeatDouble = True
    if repeatSplit and repeatDouble:
        num += 1
        print('nice')
    else:
        print('naughty')
print(num)