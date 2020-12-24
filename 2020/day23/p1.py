import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    cups = list(f.read())
f.close()
highestVal = int(cups[0])
lowestVal = int(cups[0])
for cup in cups:
    if highestVal < int(cup):
        highestVal = int(cup)
    elif lowestVal > int(cup):
        lowestVal = int(cup)
curCup = 0
for move in range(100):
    curCupLabel = cups[curCup]
    print('-- move ' + str(move + 1) + ' --')
    cupString = '' 
    for cupCount, cup in enumerate(cups): 
        if cupCount == curCup: 
            cupString += '(' + cup + ') ' 
        else:
            cupString += cup + ' '
    print('cups: ' + cupString)

    if curCup + 3 < len(cups):
        pickUp = cups[curCup + 1: curCup + 4]
    else:
        pickUp = cups[curCup + 1:] + cups[:3 - len(cups[curCup + 1:])]
    print('pick up: ' + ', '.join(pickUp))
    
    destination = int(cups[curCup])
    destinationFound = False
    while not destinationFound:
        destination -= 1
        if destination < lowestVal:
            destination = highestVal
        for cup in cups:
            if int(cup) == destination and cup not in pickUp:
                destinationFound = True
                break
    print('destination: ' + str(destination) + '\n')

    for cup in pickUp:
        if curCup + 1 < len(cups):
            cups.pop(curCup + 1)
        else:
            cups.pop(0)
    destinationIndex = cups.index(str(destination)) + 1
    for cup in reversed(pickUp):
        cups.insert(destinationIndex, cup)

    curCup = (cups.index(curCupLabel) + 1) % len(cups)


print('-- final --')
cupString = '' 
for cupCount, cup in enumerate(cups): 
    if cupCount == curCup: 
        cupString += '(' + cup + ') ' 
    else:
        cupString += cup + ' '
print('cups: ' + cupString)