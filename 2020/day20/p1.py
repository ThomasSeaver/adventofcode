import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    tiles = f.read().split('\n\n')
f.close()

tileSet = []
for tile in tiles:
    tileSet.append((tile.split('\n')[0].split(' ')[1][:-1], tile.split('\n')[1:]))

cornerSet = []

for tileA in tileSet:
    topA = tileA[1][0]
    botA = tileA[1][-1]
    leftA = ''
    rightA = ''
    for row in tileA[1]:
        leftA += row[0]
        rightA += row[-1]
    matchingEdge = 0
    for tileB in tileSet:
        if not tileA == tileB: 
            topB = tileB[1][0]
            botB = tileB[1][-1]
            leftB = ''
            rightB = ''
            for row in tileB[1]:
                leftB += row[0]
                rightB += row[-1]
            
            leftAFound = leftA == topB or leftA == topB[::-1] or leftA == botB or leftA == botB[::-1] or leftA == leftB or leftA == leftB[::-1] or leftA == rightB or leftA == rightB[::-1]
            
            rightAFound = rightA == topB or rightA == topB[::-1] or rightA == botB or rightA == botB[::-1] or rightA == leftB or rightA == leftB[::-1] or rightA == rightB or rightA == rightB[::-1]
            
            topAFound = topA == topB or topA == topB[::-1] or topA == botB or topA == botB[::-1] or topA == leftB or topA == leftB[::-1] or topA == rightB or topA == rightB[::-1]
            
            botAFound = botA == topB or botA == topB[::-1] or botA == botB or botA == botB[::-1] or botA == leftB or botA == leftB[::-1] or botA == rightB or botA == rightB[::-1]

            if leftAFound or rightAFound or topAFound or botAFound:
                matchingEdge += 1
    if matchingEdge == 2:
        cornerSet.append(int(tileA[0]))
print(cornerSet)

multSum = 1
for corner in cornerSet:
    multSum *= corner
print(multSum)


