input = ''

with open('i1.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: int(x.strip()), lines))

lastValue = input[0]
increments = 0
for value in input:
    if value > lastValue:
        increments += 1
    lastValue = value

print(increments)