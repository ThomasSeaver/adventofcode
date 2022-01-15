import string

with open('i.txt') as f:
    lines = f.readlines()
    inputs = ''.join(lines).split('\n***\n')
    inputs = list(map(lambda x: x.split('\n'), inputs))

for input in inputs:
    print('min sum')
    input = list(map(lambda w: [int(c) for c in w], input))
    dest = (len(input[0]) - 1, len(input) - 1)

    global minSum
    minSum = 1000000

    def getPaths(curPos, curSum):
        global minSum

        curValue = input[curPos[1]][curPos[0]]

        if curValue + curSum >= minSum: 
            return []

        if curPos == dest:
            minSum = curSum + curValue
            print(minSum)
            return [curSum + curValue]

        potentialPositions = [(curPos[0] + 1, curPos[1]), (curPos[0], curPos[1] + 1)]
        potentialPositions = list(filter(lambda p: p[0] <= dest[0] and p[1] <= dest[1], potentialPositions))
        potentialPositions = sorted(potentialPositions, key=lambda p: input[p[1]][p[0]])

        paths = []
        for position in potentialPositions:
            paths += getPaths(position, curSum + curValue)

        return paths

    paths = getPaths((0, 0), 0)
    print()
    paths.sort()
    print(len(paths))
    print(paths[0] - input[0][0])
    print()