import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = list(f.read())
f.close()
highestVal = int(input[0])
lowestVal = int(input[0])
for cup in input:
    if highestVal < int(cup):
        highestVal = int(cup)
    elif lowestVal > int(cup):
        lowestVal = int(cup)

while highestVal != 1000000:
    highestVal += 1
    input.append(str(highestVal))

cups = dict()
for index in range(len(input)):
    if index + 1 != len(input):
        cups.update({input[index]: input[index + 1]})
    else:
        cups.update({input[index]: input[0]})

curCup = input[0]
for move in range(10000000):
    if ((move + 1) % 1000000 == 0):
        print('-- move ' + str(move + 1) + ' --')

    pickUp = []
    for i in range(3):
        pickUp.append(cups[curCup])
        cups[curCup] = cups[cups[curCup]]

    destination = str(int(curCup) - 1)
    while destination not in cups or destination in pickUp:
        destination = str(int(destination) - 1)
        if int(destination) < lowestVal:
            destination = str(highestVal)
    lastCup = cups[destination]
    cups[destination] = pickUp[0]
    cups[pickUp[2]] = lastCup
    curCup = cups[curCup]

print(cups['1'])
print(cups[cups['1']])
print(int(cups['1']) * int(cups[cups['1']]))

