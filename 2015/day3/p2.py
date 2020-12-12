import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read()
length = len(input)
f.close()

left = 0
right = 0
up = 0
down = 0
for x in input:
    if x == '<':
        left += 1
    elif x == '>':
        right += 1
    elif x == 'v':
        down += 1
    elif x == '^':
        up += 1

ar = [[0 for x in range(left + right)] for x in range(up + down)]
pos = [down, right]
roboPos = [down, right]
ar[pos[0]][pos[1]] = 1

for i, x in enumerate(input):
    if i % 2 == 0:
        if x == '<':
            pos[1] -= 1
        elif x == '>':
            pos[1] += 1
        elif x == 'v':
            pos[0] += 1
        elif x == '^':
            pos[0] -= 1
        ar[pos[0]][pos[1]] = 1
    else:
        if x == '<':
            roboPos[1] -= 1
        elif x == '>':
            roboPos[1] += 1
        elif x == 'v':
            roboPos[0] += 1
        elif x == '^':
            roboPos[0] -= 1
        ar[roboPos[0]][roboPos[1]] = 1

num = 0
for x in ar:
    for y in x:
        if y == 1:
            num += 1
print(num)