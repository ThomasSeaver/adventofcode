input = ''

with open('i1.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: int(x.strip()), lines))


length = len(input)
increases = 0

for index in range(3, length):
    sumA = input[index - 3] + input[index - 2] + input[index - 1]
    sumB = input[index - 2] + input[index - 1] + input[index]
    if (sumB > sumA):
        increases += 1

print(increases)