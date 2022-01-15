with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

def find(func, arr):
    return next(filter(func, arr), None)

def findList(func, arr):
    return list(filter(func, arr))

input = list(map(lambda l: l.split(' | '), input))

outputSum = 0

for line in input:
    combinations = list(map(lambda c: ''.join(sorted(list(c))), line[0].split(' ')))

    signals = {}
    numbers = {}

    # these numbers are trivial to decipher since they have unique lengths
    numbers['1'] = find(lambda x: len(x) == 2, combinations)
    numbers['4'] = find(lambda x: len(x) == 4, combinations)
    numbers['7'] = find(lambda x: len(x) == 3, combinations)
    numbers['8'] = find(lambda x: len(x) == 7, combinations)

    # 4 contains all the signals from 1 plus signals b / d
    bd = findList(lambda x: x not in list(numbers['1']), numbers['4'])

    # 2, 3, 5 all contain 5 signals
    fives = findList(lambda x: len(x) == 5, combinations)
    fivesCombined = list(''.join(fives))
    # I don't like this but I also really want to do it in one line so... need to get count so we can identify unique signals in set
    countedSignals = list(map(lambda x: x if len(findList(lambda y: x == y, fivesCombined)) == 1 else None, ['a', 'b', 'c', 'd', 'e', 'f', 'g']))
    
    # b and e signals only appear once in these combined signal sets though, so we can identify them
    be = findList(lambda x: x != None, countedSignals)

    # since we know b and d in one set, and b and e in another, we can identify b as the common and subsequently e and d as uniques
    signals['b'] = find(lambda x: find(lambda y: y == x, bd) != None, be)
    signals['d'] = find(lambda x: x != signals['b'], bd)
    signals['e'] = find(lambda x: x != signals['b'], be)

    # with these signals we can determine which numbers correspond to each set of five signals
    numbers['2'] = find(lambda x: find(lambda y: y == signals['e'], x) != None, fives)
    numbers['5'] = find(lambda x: find(lambda y: y == signals['b'], x) != None, fives)
    numbers['3'] = find(lambda x: x != numbers['2'] and x != numbers['5'], fives)

    # we can grab the six length signals now
    sixes = findList(lambda x: len(x) == 6, combinations)
    
    # and identify them by the signals they're missing
    numbers['0'] = find(lambda x: find(lambda y: y == signals['d'], x) == None, sixes)
    numbers['9'] = find(lambda x: find(lambda y: y == signals['e'], x) == None, sixes)
    numbers['6'] = find(lambda x: x != numbers['0'] and x != numbers['9'], sixes)

    outputSignals = list(map(lambda c: ''.join(sorted(list(c))), line[1].split(' ')))

    outputValue = ''

    for output in outputSignals:
        for key, value in numbers.items():
            if value == output:
                outputValue += key
                break
    
    outputSum += int(outputValue)

print(outputSum)