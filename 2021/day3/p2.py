input = ''

with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

mostCommon = input

for index in range(len(input[0])):
    zeroes = 0
    ones = 0
    for line in mostCommon:
        bit = line[index]
        if bit == '0':
            zeroes += 1
        else:
            ones += 1
    if zeroes > ones:
        mostCommon = filter(lambda x: x[index] == '0', mostCommon)
    else: 
        mostCommon = filter(lambda x: x[index] == '1', mostCommon)
    
leastCommon = input

for index in range(len(input[0])):
    if (len(leastCommon) == 1):
        break
    zeroes = 0
    ones = 0
    for line in leastCommon:
        bit = line[index]
        if bit == '0':
            zeroes += 1
        else:
            ones += 1
    if zeroes <= ones:
        leastCommon = filter(lambda x: x[index] == '0', leastCommon)
    else: 
        leastCommon = filter(lambda x: x[index] == '1', leastCommon)

def fromBinary(val):
    sum = 0
    for char in val:
        sum *= 2
        sum += int(char)
    return sum

print(fromBinary(mostCommon[0]))
print(fromBinary(leastCommon[0]))
print(fromBinary(mostCommon[0]) * fromBinary(leastCommon[0]))