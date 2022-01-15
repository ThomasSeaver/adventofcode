with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))


input = list(map(lambda x: list(x), input))
input = list(map(lambda x: list(map(lambda y: {'val': int(y), 'basin': False}, x)), input))

def countSpots(rowIndex, spotIndex):
    spot = input[rowIndex][spotIndex]['val']
    if spot == 9 or input[rowIndex][spotIndex]['basin']:
        return 0
    sum = 1
    
    input[rowIndex][spotIndex]['basin'] = True

    left = spotIndex != 0 
    right = spotIndex != len(row) - 1 
    top = rowIndex != 0 
    bottom = rowIndex != len(input) - 1

    if left:
        sum += countSpots(rowIndex, spotIndex - 1)
    if right:
        sum += countSpots(rowIndex, spotIndex + 1)
    if top:
        sum += countSpots(rowIndex - 1, spotIndex)
    if bottom:
        sum += countSpots(rowIndex + 1, spotIndex)

    return sum


basinSizes = []
for rowIndex in range(len(input)): 
    row = input[rowIndex]
    for spotIndex in range(len(row)):
        spot = row[spotIndex]['val']
        
        leftBigger = spotIndex == 0 or spot < row[spotIndex - 1]['val']
        rightBigger = spotIndex == len(row) - 1 or spot < row[spotIndex + 1]['val']
        topBigger = rowIndex == 0 or spot < input[rowIndex - 1][spotIndex]['val']
        bottomBigger = rowIndex == len(input) - 1 or spot < input[rowIndex + 1][spotIndex]['val']

        if leftBigger and rightBigger and topBigger and bottomBigger:
            basinSizes.append(countSpots(rowIndex, spotIndex))

basinSizes.sort(reverse=True)
print(basinSizes)
print(basinSizes[0] * basinSizes[1] * basinSizes[2])


print('\n'.join(list(map(lambda x: ''.join(list(map(lambda y: "\033[95m" + str(y['val']) + "\033[0m" if y['basin'] else str(y['val']), x))), input))))