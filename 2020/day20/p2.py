import sys
import math
import copy

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    tiles = f.read().split('\n\n')
f.close()

def vertFlip(tileVal):
    newTileVal = ['' for x in range(len(tileVal))]
    for j in range(len(tileVal)):
        for k in reversed(range(len(tileVal))):
            newTileVal[j] += tileVal[j][k]
    tileVal = newTileVal
    return tileVal

def horizFlip(tileVal):
    newTileVal = ['' for x in range(len(tileVal))]
    for j in range(len(tileVal)):
        for k in range(len(tileVal)):
            newTileVal[j] += tileVal[len(tileVal) - 1 - j][k]
    tileVal = newTileVal
    return tileVal


def rotate(tileVal, rotations):
    for i in range(rotations):
        newTileVal = ['' for x in range(len(tileVal))]
        for j in range(len(tileVal)):
            for k in reversed(range(len(tileVal))):
                newTileVal[j] += tileVal[k][j]
        tileVal = newTileVal
    return tileVal


tileSet = []
for tile in tiles:
    tileSet.append((tile.split('\n')[0].split(' ')[1][:-1], tile.split('\n')[1:]))

countSet = {}

for tileA in tileSet:
    topA = tileA[1][0]
    botA = tileA[1][-1]
    leftA = ''
    rightA = ''
    for row in tileA[1]:
        leftA += row[0]
        rightA += row[-1]
    matchingEdge = 0
    leftAFound = False
    rightAFound = False
    topAFound = False
    botAFound = False
    for tileB in tileSet:
        if not tileA == tileB: 
            topB = tileB[1][0]
            botB = tileB[1][-1]
            leftB = ''
            rightB = ''
            for row in tileB[1]:
                leftB += row[0]
                rightB += row[-1]
            
            leftAFound = leftAFound or leftA == topB or leftA == topB[::-1] or leftA == botB or leftA == botB[::-1] or leftA == leftB or leftA == leftB[::-1] or leftA == rightB or leftA == rightB[::-1]
            
            rightAFound = rightAFound or rightA == topB or rightA == topB[::-1] or rightA == botB or rightA == botB[::-1] or rightA == leftB or rightA == leftB[::-1] or rightA == rightB or rightA == rightB[::-1]
            
            topAFound = topAFound or topA == topB or topA == topB[::-1] or topA == botB or topA == botB[::-1] or topA == leftB or topA == leftB[::-1] or topA == rightB or topA == rightB[::-1]
            
            botAFound = botAFound or botA == topB or botA == topB[::-1] or botA == botB or botA == botB[::-1] or botA == leftB or botA == leftB[::-1] or botA == rightB or botA == rightB[::-1]



    matchingStr = ""
    matchingCount = 0
    if leftAFound:
        matchingCount += 1
        matchingStr += 'x'
    else: 
        matchingStr += 'o'
    if topAFound:
        matchingCount += 1
        matchingStr += 'x'
    else: 
        matchingStr += 'o'
    if rightAFound:
        matchingCount += 1
        matchingStr += 'x'
    else: 
        matchingStr += 'o'
    if botAFound:
        matchingCount += 1
        matchingStr += 'x'
    else: 
        matchingStr += 'o'
    
    countSet.update({tileA[0]: [matchingCount, matchingStr]})

size = int(math.sqrt(len(tileSet)))
tileMap = [[[] for x in range(size)] for x in range(size)]

origTileSet = copy.deepcopy(tileSet)
runCount = 0
control = 0
while runCount < 1 and len(tileSet) > 0:
    tileMap = [[[] for x in range(size)] for x in range(size)]
    runCount += 1
    tileSet = copy.deepcopy(origTileSet)
    for rowCount, tileRow in enumerate(tileMap):
        for cellCount, tileCell in enumerate(tileRow):
            if rowCount == 0:
                if cellCount == 0:
                    for tileCount, tile in enumerate(tileSet):
                        id = tile[0]
                        tileVal = tile[1]
                        edges = countSet.get(id)
                        if edges[0] == 2:
                            if control == 1:
                                tileVal = horizFlip(tileVal)
                                if edges[1][1] == 'x':
                                    edges[1] = edges[1][0] + 'o' + edges[1][2] + 'x'
                                else:
                                    edges[1] = edges[1][0] + 'x' + edges[1][2] + 'o'
                            if edges[1] == 'ooxx':
                                tileMap[rowCount][cellCount] = tileVal
                            else:
                                rotations = 0
                                while edges[1] != 'ooxx':
                                    edges[1] = edges[1][-1:] + edges[1][:-1]
                                    rotations += 1
                                tileMap[rowCount][cellCount] = rotate(tileVal, rotations)
                                tileSet.pop(tileCount)
                                break
                elif cellCount != len(tileRow) - 1:
                    for tileCount, tile in enumerate(tileSet):
                        id = tile[0]
                        tileVal = tile[1]
                        edges = countSet.get(id)
                        if edges[0] == 3:
                            oldEdges = edges[1]
                            if edges[1] != 'xoxx':
                                rotations = 0
                                while edges[1] != 'xoxx':
                                    edges[1] = edges[1][-1:] + edges[1][:-1]
                                    rotations += 1
                                tileVal = rotate(tileVal, rotations)
                            lastTile = tileMap[rowCount][cellCount - 1] 
                            lastRight = ''
                            for row in lastTile:
                                lastRight += row[-1:]
                            newLeft = ''
                            newRight = ''
                            for row in tileVal:
                                newLeft += row[0]
                                newRight += row[-1:]
                            if newLeft == lastRight:
                                tileMap[rowCount][cellCount] = tileVal
                                tileSet.pop(tileCount)
                                break
                            elif newRight == lastRight:
                                tileMap[rowCount][cellCount] = vertFlip(tileVal)
                                tileSet.pop(tileCount)
                                break
                            else:
                                edges[1] = oldEdges
                else: 
                    for tileCount, tile in enumerate(tileSet):
                        id = tile[0]
                        tileVal = tile[1]
                        edges = countSet.get(id)
                        if edges[0] == 2:
                            oldEdges = edges[1]
                            if edges[1] != 'xoox':
                                rotations = 0
                                while edges[1] != 'xoox':
                                    edges[1] = edges[1][-1:] + edges[1][:-1]
                                    rotations += 1
                                tileVal = rotate(tileVal, rotations)
                            lastTile = tileMap[rowCount][cellCount - 1] 
                            lastRight = ''
                            for row in lastTile:
                                lastRight += row[-1:]
                            newLeft = ''
                            newBottom = tileVal[-1:][0]
                            for row in tileVal:
                                newLeft += row[0]
                            if newLeft == lastRight:
                                tileMap[rowCount][cellCount] = tileVal
                                tileSet.pop(tileCount)
                                break
                            elif lastRight == newBottom[::-1]:
                                tileMap[rowCount][cellCount] = rotate(vertFlip(tileVal), 1)
                                tileSet.pop(tileCount)
                                break
                            else:
                                edges[1] = oldEdges
            elif rowCount != len(tileMap) - 1:
                if cellCount == 0:
                    for tileCount, tile in enumerate(tileSet):
                        id = tile[0]
                        tileVal = tile[1]
                        edges = countSet.get(id)
                        if edges[0] == 3:
                            oldEdges = edges[1]
                            if edges[1] != 'oxxx':
                                rotations = 0
                                while edges[1] != 'oxxx':
                                    edges[1] = edges[1][-1:] + edges[1][:-1]
                                    rotations += 1
                                tileVal = rotate(tileVal, rotations)
                            topTile = tileMap[rowCount - 1][cellCount] 
                            topBottom = topTile[-1:]
                            
                            newTop = [tileVal[0]]
                            newBottom = tileVal[-1:]
                            if topBottom == newTop:
                                tileMap[rowCount][cellCount] = tileVal
                                tileSet.pop(tileCount)
                                break
                            elif topBottom == newBottom:
                                tileMap[rowCount][cellCount] = horizFlip(tileVal)
                                tileSet.pop(tileCount)
                                break
                            else:
                                edges[1] = oldEdges
                elif cellCount != len(tileRow) - 1:
                    for tileCount, tile in enumerate(tileSet):
                        id = tile[0]
                        tileVal = tile[1]
                        edges = countSet.get(id)
                        if edges[0] == 4:
                            topTile = tileMap[rowCount - 1][cellCount] 
                            topBottom = topTile[-1:][0]
                            lastTile = tileMap[rowCount][cellCount - 1]
                            lastRight = ''
                            for row in lastTile:
                                lastRight += row[-1:]

                            for r in range(4):
                                tileVal = rotate(tileVal, 1)
                                newTop = tileVal[0]
                                newBottom = tileVal[-1:]
                                newLeft = ''
                                newRight = ''
                                for row in tileVal:
                                    newLeft += row[0]
                                    newRight += row[-1:]

                                if newRight == lastRight and newTop == topBottom[::-1]:
                                    tileVal = vertFlip(tileVal)
                                    newTop = tileVal[0]
                                    newLeft = newRight
                                    break
                                elif newBottom == topBottom and newLeft == lastRight[::-1]:
                                    tileVal = horizFlip(tileVal)
                                    newTop = tileVal[0]
                                    newLeft = newLeft[::-1]
                                    break
                                elif newLeft == lastRight and newTop == topBottom:
                                    break

                            if newLeft == lastRight and newTop == topBottom:
                                tileMap[rowCount][cellCount] = tileVal
                                tileSet.pop(tileCount)
                                break
                else: 
                    for tileCount, tile in enumerate(tileSet):
                        id = tile[0]
                        tileVal = tile[1]
                        edges = countSet.get(id)
                        if edges[0] == 3:
                            oldEdges = edges[1]
                            if edges[1] != 'xxox':
                                rotations = 0
                                while edges[1] != 'xxox':
                                    edges[1] = edges[1][-1:] + edges[1][:-1]
                                    rotations += 1
                                tileVal = rotate(tileVal, rotations)
                            topTile = tileMap[rowCount - 1][cellCount] 
                            topBottom = topTile[-1:]
                            lastTile = tileMap[rowCount][cellCount - 1]
                            lastRight = ''
                            for row in lastTile:
                                lastRight += row[-1:]

                            newLeft = ''
                            for row in tileVal:
                                newLeft += row[0]
                            
                            newTop = [tileVal[0]]
                            newBottom = tileVal[-1:]
                            if topBottom == newTop and newLeft == lastRight:
                                tileMap[rowCount][cellCount] = tileVal
                                tileSet.pop(tileCount)
                                break
                            elif topBottom == newBottom and lastRight == newLeft[::-1]:
                                tileMap[rowCount][cellCount] = horizFlip(tileVal)
                                tileSet.pop(tileCount)
                                break
                            else:
                                edges[1] = oldEdges
            else:
                if cellCount == 0:
                    for tileCount, tile in enumerate(tileSet):
                        id = tile[0]
                        tileVal = tile[1]
                        edges = countSet.get(id)
                        if edges[0] == 2:
                            oldEdges = edges[1]
                            if edges[1] != 'oxxo':
                                rotations = 0
                                while edges[1] != 'oxxo':
                                    edges[1] = edges[1][-1:] + edges[1][:-1]
                                    rotations += 1
                                tileVal = rotate(tileVal, rotations)
                            topTile = tileMap[rowCount - 1][cellCount] 
                            topBottom = topTile[-1:]

                            newLeft = ''
                            newRight = ''
                            for row in tileVal:
                                newLeft += row[0]
                                newRight += row[-1:]
                            
                            newTop = [tileVal[0]]
                            if topBottom == newTop:
                                tileMap[rowCount][cellCount] = tileVal
                                tileSet.pop(tileCount)
                                break
                            elif topBottom == [newRight[::-1]]:
                                tileMap[rowCount][cellCount] = rotate(vertFlip(tileVal), 1)
                                tileSet.pop(tileCount)
                                break
                            else:
                                edges[1] = oldEdges
                elif cellCount != len(tileRow) - 1:
                    for tileCount, tile in enumerate(tileSet):
                        id = tile[0]
                        tileVal = tile[1]
                        edges = countSet.get(id)
                        if edges[0] == 3:
                            oldEdges = edges[1]
                            if edges[1] != 'xxxo':
                                rotations = 0
                                while edges[1] != 'xxxo':
                                    edges[1] = edges[1][-1:] + edges[1][:-1]
                                    rotations += 1
                                tileVal = rotate(tileVal, rotations)
                            topTile = tileMap[rowCount - 1][cellCount] 
                            topBottom = topTile[-1:]
                            lastTile = tileMap[rowCount][cellCount - 1] 
                            lastRight = ''
                            for row in lastTile:
                                lastRight += row[-1:]

                            newLeft = ''
                            newRight = ''
                            for row in tileVal:
                                newLeft += row[0]
                                newRight += row[-1:]
                            newTop = [tileVal[0]] 

                            if newLeft == lastRight and topBottom == newTop:
                                tileMap[rowCount][cellCount] = tileVal
                                tileSet.pop(tileCount)
                                break
                            elif newRight == lastRight and topBottom[0] == newTop[0][::-1]:
                                tileMap[rowCount][cellCount] = vertFlip(tileVal)
                                tileSet.pop(tileCount)
                                break
                            else:
                                edges[1] = oldEdges

                else:
                    for tileCount, tile in enumerate(tileSet):
                        id = tile[0]
                        tileVal = tile[1]
                        edges = countSet.get(id)
                        if edges[0] == 2:
                            oldEdges = edges[1]
                            if edges[1] != 'xxoo':
                                rotations = 0
                                while edges[1] != 'xxoo':
                                    edges[1] = edges[1][-1:] + edges[1][:-1]
                                    rotations += 1
                                tileVal = rotate(tileVal, rotations)
                            topTile = tileMap[rowCount - 1][cellCount] 
                            topBottom = topTile[-1:]
                            lastTile = tileMap[rowCount][cellCount - 1] 
                            lastRight = ''
                            for row in lastTile:
                                lastRight += row[-1:]
                            newLeft = ''
                            for row in tileVal:
                                newLeft += row[0]    
                            
                            newTop = [tileVal[0]]    
                            
                            if newLeft == lastRight and newTop == topBottom:
                                tileMap[rowCount][cellCount] = tileVal
                                tileSet.pop(tileCount)
                                break
                            elif newLeft == topBottom[::-1][0] and newTop[0] == lastRight:
                                tileMap[rowCount][cellCount] = rotate(horizFlip(tileVal), 1)
                                tileSet.pop(tileCount)
                                break
                            else:
                                edges[1] = oldEdges

            control = 1


img = []
for tileRow in tileMap:
    strings = ['' for x in range(len(tileRow[0]))]
    for count, tile in enumerate(tileRow):
        for i in range(len(tile)):
            strings[i] += tile[i][1:-1]
    img += strings[1:-1]
print('\n'.join(img))

seaDragonSpots = [(0, -1), (1, 0), (1, -1), (1, -2), (2, -3), (2, -6), (1, -7), (1, -8), (2, -9), (2, -12), (1, -13), (1, -14), (2, -15), (2, -18), (1, -19)]


for m in range(2):
    if m == 1:
        img = horizFlip(img)
    for r in range(4):
        img = rotate(img, r)
        seaDragonCount = 0  
        for i, y in enumerate(img):
            for j, x in enumerate(y):
                if j >= 19 and i <= len(img) - 3:
                    seaDragon = True
                    for spot in seaDragonSpots:
                        if img[i + spot[0]][j + spot[1]] != '#':
                            seaDragon = False
                            break
                    if seaDragon:
                        seaDragonCount += 1
        if seaDragonCount != 0:
            poundCount = 0
            for i, y in enumerate(img):
                for j, x in enumerate(y):
                    if x == '#':
                        poundCount += 1
            print(poundCount - seaDragonCount * 15)
        else:
            print(seaDragonCount)