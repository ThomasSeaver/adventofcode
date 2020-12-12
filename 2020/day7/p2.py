class bag:
    def __init__(self, color, contains):
        self.color = color
        self.contains = contains

    def __repr__(self):
        return f'a {self.color} contains {self.contains}'

def colorToIndex(color):
    for entry in bagDict:
        if entry[0] == color:
            return entry[1]

def analyzeBag(rule):
    if rule[1] == [None]:
        return False

    for color in rule[1]:
        if color == shinyGold:
            return True

    subBags = False
    for color in rule[1]:
        subBags = subBags or analyzeBag(input[color])
        if subBags:
            return True
    return False

def bagCount(bag):
    if bag[1] == [None]:
        return 0
    
    count = 0
    for subBag in bag[1]:
        count += subBag[0] + subBag[0] * bagCount(input[subBag[1]])
    return count
    

# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()

bagDict = [('', 0) for x in range(length)]
shinyGold = 0

for i, rule in enumerate(input):
    color = rule.split(' contain ')[0].split(' bag')[0]
    if color == 'shiny gold':
        shinyGold = i
    bagDict[i] = (color, i)

for i in range(length):
    color = colorToIndex(input[i].split(' contain ')[0].split(' bag')[0])
    contains = (input[i].split(' contain ')[1][:-1]).split(', ')
    if (contains[0][0] != 'n'):
        for j in range(len(contains)):
            contains[j] = (int(contains[j].split(' ')[0]), colorToIndex(contains[j].split(' bag')[0][2:]))
    else:
        contains = [None]
    input[i] = (color, contains)

print(input)

print(bagCount(input[shinyGold]))