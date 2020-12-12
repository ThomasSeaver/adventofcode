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
ar[pos[0]][pos[1]] = 1

for x in input:
    if x == '<':
        pos[1] -= 1
    elif x == '>':
        pos[1] += 1
    elif x == 'v':
        pos[0] += 1
    elif x == '^':
        pos[0] -= 1
    ar[pos[0]][pos[1]] = 1

num = 0
for x in ar:
    for y in x:
        if y == 1:
            num += 1
print(num)