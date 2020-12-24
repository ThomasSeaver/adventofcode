import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
f.close()

pairMap = dict({'e': 'w', 'w': 'e', 'nw': 'se', 'ne': 'sw', 'sw': 'ne', 'se': 'nw'})
combMap = dict({
    ('e', 'nw'): 'ne', 
    ('e', 'sw'): 'se', 
    ('sw', 'e'): 'se', 
    ('nw', 'e'): 'ne', 
    ('w', 'ne'): 'nw', 
    ('w', 'se'): 'sw', 
    ('se', 'w'): 'sw', 
    ('ne', 'w'): 'nw', 
    ('nw', 'sw'): 'w', 
    ('sw', 'nw'): 'w', 
    ('ne', 'se'): 'e', 
    ('se', 'ne'): 'e', 
    })

for i in range(len(input)):
    toFlip = input[i]
    toFlipList = []
    count = 0
    while count < len(toFlip):
        char = toFlip[count]
        if char == 'e' or char == 'w':
            toFlipList.append(char)
        else:
            toFlipList.append(toFlip[count:count + 2])
            count += 1
        count += 1
    
    oldLen = -1
    while oldLen != len(toFlipList):
        oldLen = len(toFlipList)
        count = 0
        while count < len(toFlipList):
            subCount = count + 1
            charA = toFlipList[count]
            while subCount < len(toFlipList):
                charB = toFlipList[subCount]
                if pairMap[charA] == charB:
                    toFlipList.pop(subCount)
                    toFlipList.pop(count)
                    count -= 1
                    break
                subCount += 1
            count += 1
        
        count = 0
        while count < len(toFlipList):
            subCount = count + 1
            charA = toFlipList[count]
            while subCount < len(toFlipList):
                charB = toFlipList[subCount]
                if (charA, charB) in combMap:
                    toFlipList.pop(subCount)
                    toFlipList.pop(count)
                    toFlipList.insert(count, combMap[(charA, charB)])
                    break
                subCount += 1
            count += 1
        
    toFlipList.sort()
    input[i] = ''.join(toFlipList)

flipped = 0
finalDict = {}
for toFlip in input:
    if toFlip in finalDict:
        finalDict.update({toFlip: finalDict[toFlip] + 1})
    else:
        finalDict.update({toFlip: 1})
    if finalDict[toFlip] % 2 == 1:
        flipped += 1
    else:
        flipped -= 1
print(finalDict)
print(flipped)