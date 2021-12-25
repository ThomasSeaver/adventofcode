input = ''

with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

depth = 0
horizontal = 0
for line in input:
    if (len(line) == 9):
        horizontal += int(line[8])
    elif (len(line) == 4):
        depth -= int(line[3])
    elif (len(line) == 6):
        depth += int(line[5])

print(depth)
print(horizontal)
print(depth * horizontal)