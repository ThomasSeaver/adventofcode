with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))


input = list(map(lambda x: list(x), input))

sum = 0
for rowIndex in range(len(input)): 
    row = input[rowIndex]
    for spotIndex in range(len(row)):
        spot = row[spotIndex]
        
        leftLower = spotIndex == 0 or spot < row[spotIndex - 1]
        rightLower = spotIndex == len(row) - 1 or spot < row[spotIndex + 1]
        topLower = rowIndex == 0 or spot < input[rowIndex - 1][spotIndex]
        bottomLower = rowIndex == len(input) - 1 or spot < input[rowIndex + 1][spotIndex]

        if leftLower and rightLower and topLower and bottomLower:
            sum += int(spot) + 1
print(sum)