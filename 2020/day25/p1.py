import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
f.close()

def getLoopSize(key, subjectNumber):
    loopSize = 0
    value = 1
    while value != key:
        value *= subjectNumber
        value %= 20201227
        loopSize += 1
    return loopSize

def transform(loopSize, subjectNumber):
    value = 1
    for i in range(loopSize):
        value *= subjectNumber
        value %= 20201227
    return value


cardKey = int(input[0])
doorKey = int(input[1])

cardLoopSize = getLoopSize(cardKey, 7)
doorLoopSize = getLoopSize(doorKey, 7)

encryptionKey = transform(cardLoopSize, doorKey)
print(encryptionKey)