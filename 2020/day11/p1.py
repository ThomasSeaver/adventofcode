import copy


def countOccupied(i, j, lastMap):
    count = 0

    if (i != 0 and j != 0):
        if (lastMap[i - 1][j - 1] == '#'):
            count += 1
    if (i != 0):
        if (lastMap[i - 1][j] == '#'):
            count += 1
    if (j != 0):
        if (lastMap[i][j - 1] == '#'):
            count += 1
    if (i != len(lastMap) - 1 and j != len(lastMap[i]) - 1):
        if (lastMap[i + 1][j + 1] == '#'):
            count += 1
    if (i != len(lastMap) - 1):
        if (lastMap[i + 1][j] == '#'):
            count += 1
    if (j != len(lastMap[i]) - 1):
        if (lastMap[i][j + 1] == '#'):
            count += 1
    if (i != 0 and j != len(lastMap[i]) - 1):
        if (lastMap[i - 1][j + 1] == '#'):
            count += 1
    if (i != len(lastMap) - 1 and j != 0):
        if (lastMap[i + 1][j - 1] == '#'):
            count += 1

    return count

# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()

for i in range(length):
    input[i] = list(input[i])

lastOccupied = -1
occupied = 0
seatMap = input
while lastOccupied != occupied:
    for i in range(len(seatMap)):
        print(''.join(seatMap[i]))
    print()
    lastOccupied = occupied
    lastMap = copy.deepcopy(seatMap)
    for i in range(len(lastMap)):
        for j in range(len(lastMap[i])):
            curSeat = lastMap[i][j]
            adjOccupied = countOccupied(i, j, lastMap)
            if (curSeat == 'L' and adjOccupied == 0):
                seatMap[i][j] = '#'
                occupied += 1
            elif (curSeat == '#' and adjOccupied >= 4):
                seatMap[i][j] = 'L'
                occupied -= 1
print(occupied)