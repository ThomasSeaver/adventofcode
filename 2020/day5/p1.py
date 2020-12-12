def binToDec(binNum):
    res = 0
    mult = 1
    for num in reversed(binNum):
        res += int(num) * mult
        mult *= 2
    return res


def charToBin(str):
    res = ""
    for letter in str:
        if letter == 'F' or letter == 'L':
            res += '0'
        else:
            res += '1'
    return res

seatMap = [[0 for x in range(8)] for x in range(128)]

# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()

for boardingPass in input:
    row = binToDec(charToBin(boardingPass[:7]))
    col = binToDec(charToBin(boardingPass[7:]))
    seatMap[row][col] = 1

for i in range(128):
    for j in range(8):
        prevSeat = 0
        if (i != 0 and j == 0):
            prevSeat = seatMap[i - 1][7]
        elif (j != 0):
            prevSeat = seatMap[i][j - 1]
        nextSeat = 0
        if (i != 127 and j == 7):
            nextSeat = seatMap[i + 1][0]
        elif (j != 7):
            nextSeat = seatMap[i][j + 1]
        if (seatMap[i][j] == 0 and prevSeat == 1 and nextSeat == 1):
            print("row: " + str(i) + " col: " + str(j))
            print(i * 8 + j)
