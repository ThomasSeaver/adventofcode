import string

with open('i.txt') as f:
    lines = f.readlines()
    inputs = ''.join(lines).split('\n***\n')
    inputs = list(map(lambda x: x.split('\n'), inputs))

for input in inputs:
    parsing = '\n'.join(input).split('\n---\n')
    template = parsing[0]
    pairs = parsing[1]
    pairs = list(map(lambda x: x.strip().split(' -> '), pairs.split('\n')))

    pairDict = {}
    pairMap = {}

    letterDict = {}

    for pair in pairs: 
        pairDict[pair[0]] = 0
        letterDict[pair[0][0]] = 0
        letterDict[pair[0][1]] = 0
        letterDict[pair[1]] = 0
        pairMap[pair[0]] = [pair[0][0] + pair[1], pair[1] + pair[0][1]]

    letterDict[template[-1]] += 1

    total = pairDict.copy()

    for charIndex in range(len(template) - 1):
        total[template[charIndex:charIndex + 2]] += 1

    for i in range(40):
        stepTotal = pairDict.copy()
        for key in total.keys():
            exists = total[key]
            newVals = pairMap[key]
            stepTotal[newVals[0]] += exists
            stepTotal[newVals[1]] += exists
        total = stepTotal
    
    for index, (key, value) in enumerate(total.items()):
        letterDict[key[0]] += value

    print(letterDict[max(letterDict, key=letterDict.get)] - letterDict[min(letterDict, key=letterDict.get)])

