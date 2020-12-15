import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
length = len(input)
f.close()

orgSum = 0
encSum = 0
for x in input:
    orgSum += len(x)
    encSum += 2
    for letter in x:
        if letter == '"' or letter == '\\':
            encSum += 1
        encSum += 1
    print(orgSum)
    print(encSum)
print(encSum - orgSum)
    