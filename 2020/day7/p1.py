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
    for j in range(len(contains)):
        contains[j] = colorToIndex(contains[j].split(' bag')[0][2:])
    input[i] = (color, contains)

count = 0
for rule in input:
    contains = analyzeBag(rule)
    if contains:
        count += 1
print(count)