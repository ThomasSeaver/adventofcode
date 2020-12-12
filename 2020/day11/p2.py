import copy


def countOccupied(i, j, lastMap):
    count = 0

    if (i != 0 and j != 0):
        a = i - 1
        b = j - 1
        while a > 0 and b > 0 and lastMap[a][b] == '.':
            a -= 1
            b -= 1
        if (a >= 0 and b >= 0 and lastMap[a][b] == '#'):
            count += 1
    if (i != 0):
        a = i - 1
        b = j
        while a > 0 and lastMap[a][b] == '.':
            a -= 1
        if (a >= 0 and lastMap[a][b] == '#'):
            count += 1
    if (j != 0):
        a = i
        b = j - 1
        while b > 0 and lastMap[a][b] == '.':
            b -= 1
        if (b >= 0 and lastMap[a][b] == '#'):
            count += 1
    if (i != len(lastMap) - 1 and j != len(lastMap[i]) - 1):
        a = i + 1
        b = j + 1
        while a < len(lastMap) - 1 and b < len(lastMap[i]) - 1 and lastMap[a][b] == '.':
            a += 1
            b += 1
        if (a < len(lastMap) and b < len(lastMap[i]) and lastMap[a][b] == '#'):
            count += 1
    if (i != len(lastMap) - 1):
        a = i + 1
        b = j
        while a < len(lastMap) - 1 and lastMap[a][b] == '.':
            a += 1
        if (a < len(lastMap) and lastMap[a][b] == '#'):
            count += 1
    if (j != len(lastMap[i]) - 1):
        a = i
        b = j + 1
        while b < len(lastMap[i]) - 1  and lastMap[a][b] == '.':
            b += 1
        if (b < len(lastMap[i]) and lastMap[a][b] == '#'):
            count += 1
    if (i != 0 and j != len(lastMap[i]) - 1):
        a = i - 1
        b = j + 1
        while a > 0 and b < len(lastMap[i]) - 1 and lastMap[a][b] == '.':
            a -= 1
            b += 1
        if (a >= 0 and b < len(lastMap[i]) and lastMap[a][b] == '#'):
            count += 1
    if (i != len(lastMap) - 1 and j != 0):
        a = i + 1
        b = j - 1
        while a < len(lastMap) - 1 and b > 0 and lastMap[a][b] == '.':
            a += 1
            b -= 1
        if (a < len(lastMap) and b >= 0 and lastMap[a][b] == '#'):
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
    lastOccupied = occupied
    lastMap = copy.deepcopy(seatMap)
    for i in range(len(lastMap)):
        for j in range(len(lastMap[i])):
            curSeat = lastMap[i][j]
            adjOccupied = countOccupied(i, j, lastMap)
            if (curSeat == 'L' and adjOccupied == 0):
                seatMap[i][j] = '#'
                occupied += 1
            elif (curSeat == '#' and adjOccupied >= 5):
                seatMap[i][j] = 'L'
                occupied -= 1
print(occupied)