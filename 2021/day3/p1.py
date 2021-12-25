input = ''

with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

mostCommon = ''
leastCommon = ''
for index in range(len(input[0])):
    zeroes = 0
    ones = 0
    for line in input:
        bit = line[index]
        if bit == '0':
            zeroes += 1
        else:
            ones += 1
    if zeroes > ones:
        mostCommon += '0'
        leastCommon += '1'
    else:
        mostCommon += '1'
        leastCommon += '0'

def fromBinary(val):
    sum = 0
    for char in val:
        sum *= 2
        sum += int(char)
    return sum

print(fromBinary(mostCommon))
print(fromBinary(leastCommon))
print(fromBinary(mostCommon) * fromBinary(leastCommon))