with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

input = list(map(lambda l: l.split(' | '), input))

sum = 0

for line in input:
    output = line[1].split(' ')
    for value in output:
        length = len(value)
        if length < 5 or length == 7:
            sum += 1

print(sum)