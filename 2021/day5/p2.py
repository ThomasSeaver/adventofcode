def print2dAr(ar):
    ar = map(lambda l: map(lambda e: str(e), l), ar)
    ar = map(lambda l: ' '.join(l), ar)
    ar = '\n'.join(ar)
    print(ar)

with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

input = list(map(lambda l: l.split(' -> '), input))
input = list(map(lambda l: list(map(lambda i: i.split(','), l)), input))
input = list(map(lambda l: list(map(lambda i: list(map(lambda e: int(e), i)), l)), input))

# find maxes
x_max = 0
y_max = 0

for line in input:
    for pair in line:
        if pair[0] + 1 > x_max:
            x_max = pair[0] + 1
        if pair[1] + 1 > y_max:
            y_max = pair[1] + 1

field = [ [0]*x_max for _ in range(y_max) ] 


for line in input:
    line.sort(key=lambda e: e[0])
    line.sort(key=lambda e: e[0] + e[1])

    x1 = line[0][0]
    x2 = line[1][0]
    y1 = line[0][1]
    y2 = line[1][1]

    if not(x1 == x2 or y1 == y2):
        if (y1 < y2):
            for a in range(0, x2 + 1 - x1):
                field[y1 + a][x1 + a] += 1
        else:
            for a in range(0, x2 + 1 - x1):
                field[y1 - a][x1 + a] += 1
    else:
        for x in range(x1, x2 + 1):
            for y in range(y1, y2 + 1):
                field[y][x] += 1
    
sum = 0
for row in field:
    for spot in row:
        if spot >= 2:
            sum += 1

print(sum)
