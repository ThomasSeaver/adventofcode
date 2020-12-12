import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
length = len(input)
f.close()

ar = [[0 for x in range(1000)] for x in range(1000)]

for x in input:
    split = x.split(' ')
    cmd = 0
    startPos = [0,0]
    endPos = [0,0]
    if len(split) == 4:
        cmd = split[0]
        startPos = list(map(int, split[1].split(',')))
        endPos = list(map(int, split[3].split(',')))
    else:
        cmd = split[1]
        startPos = list(map(int, split[2].split(',')))
        endPos = list(map(int, split[4].split(',')))
    
    for y in range(startPos[0], endPos[0] + 1):
        for z in range(startPos[1], endPos[1] + 1):
            if cmd == 'toggle':
                ar[y][z] += 2
            elif cmd == 'on':
                ar[y][z] += 1
            elif cmd == 'off':
                ar[y][z] = max(ar[y][z] - 1, 0)

num = 0
for x in ar:
    for y in x:
        num += y
print(num)