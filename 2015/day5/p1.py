import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
length = len(input)
f.close()

num = 0
for x in input:
    vowelsList = ['a','e','i','o','u']
    vowelsCount = [0, 0, 0, 0, 0]
    doubled = False
    disallowed = False
    for i, vowel in enumerate(vowelsList):
        if vowel == x[len(x) - 1]:
            vowelsCount[i] += 1
            break
    for y in range(1, len(x)):
        val = x[y - 1: y + 1]
        if val == 'ab' or val == 'cd' or val == 'pq' or val =='xy':
            disallowed = True
            break
        if val[0] == val[1]:
            doubled = True
        for i, vowel in enumerate(vowelsList):
            if vowel == val[0]:
                vowelsCount[i] += 1
                break
    vowelSum = 0
    for y in vowelsCount:
        vowelSum += y
    vowels = False
    if vowelSum >= 3:
        vowels = True
    print(x)
    print(vowels)
    print(doubled)
    print(disallowed)
    if vowels and doubled and not disallowed:
        num += 1
        print('nice')
    else:
        print('naughty')
print(num)