import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
f.close()

def parseDirString(toFlip):
    count = 0
    toFlipList = []
    while count < len(toFlip):
        char = toFlip[count]
        if char == 'e' or char == 'w':
            toFlipList.append(char)
        else:
            toFlipList.append(toFlip[count:count + 2])
            count += 1
        count += 1
    return toFlipList

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

modMap = dict({
    'e':  (1, -1, 0),
    'w':  (-1, 1, 0),
    'ne': (1, 0, -1),
    'nw': (0, 1, -1),
    'se': (0, -1, 1),
    'sw': (-1, 0, 1)
})

neighborMod = [
    (1, -1, 0),
    (0, -1, 1),
    (-1, 0, 1),
    (-1, 1, 0),
    (0, 1, -1),
    (1, 0, -1)
]

for i in range(len(input)):
    toFlipList = parseDirString(input[i])
    
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

minimized = set()
for toFlip in input:
    if toFlip in minimized:
        minimized.remove(toFlip)
    else:
        minimized.add(toFlip)
minimized = list(map(parseDirString, minimized))

hexGrid = {}

hexDist = 200
for x in range(hexDist / -2, hexDist / 2 + 1):
    for y in range(hexDist / -2, hexDist / 2 + 1):
        for z in range(hexDist / -2, hexDist / 2 + 1):
            if x + y + z == 0:
                hexGrid.update({(x,y,z): 0})

for initial in minimized:
    x = 0
    y = 0
    z = 0
    for direction in initial:
        mod = modMap[direction]
        x += mod[0]
        y += mod[1]
        z += mod[2]
    hexGrid.update({(x,y,z): 1})


for i in range(1, 101):
    newGrid = hexGrid.copy()
    numBlack = 0
    for key, status in hexGrid.items():
        x = key[0]
        y = key[1]
        z = key[2]
        neighborCount = 0
        for neighbor in neighborMod:
            if abs(x + neighbor[0]) <= hexDist / 2 and abs(y + neighbor[1]) <= hexDist / 2 and abs(z + neighbor[2]) <= hexDist / 2:
                neighborCount += hexGrid.get((x + neighbor[0], y + neighbor[1], z + neighbor[2]))
        if (status == 0 and neighborCount == 2):
            newGrid.update({(x,y,z): 1})
        elif (status == 1 and (neighborCount == 0 or neighborCount > 2)):
            newGrid.update({(x,y,z): 0})
        numBlack += newGrid.get((x, y, z))
    hexGrid = newGrid.copy()
    print('Day ' + str(i) + ': ' + str(numBlack))