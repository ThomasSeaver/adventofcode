import sys

def process_rule(rule):
    rule = rule.split(': ')[1]
    rule = rule.split(' or ')
    rule[0] = list(map(int, rule[0].split('-')))
    rule[1] = list(map(int, rule[1].split('-')))
    return rule

def joinAr(ar):
    newAr = []
    for subAr in ar:
        newAr += subAr
    return newAr

def strictInsideRange(value, range):
    return value >= range[0] and value <= range[1]

def insideRange(value, range):
    return value >= range[0] - 1 and value <= range[1] + 1

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n\n')
    rules = joinAr(list(map(process_rule, input[0].split('\n'))))
    my_ticket = list(map(int, input[1].split('\n')[1].split(',')))
    nearby_tickets_values = joinAr([list(map(int,x.split(','))) for x in input[2].split('\n')[1:]])
f.close()

validRanges = [rules[0]]

for i in range(1, len(rules)):
    rule = rules[i]
    matchingRange = None
    for validRange in validRanges:
        if insideRange(rule[0], validRange) or insideRange(rule[1], validRange):
            matchingRange = validRange
            break
    if matchingRange != None:
        validRanges.remove(matchingRange)
        newRange = [min(rule[0], matchingRange[0]), max(rule[1], matchingRange[1])]
        matchingRange = None
        for validRange in validRanges:
            if insideRange(newRange[0], validRange) or insideRange(newRange[1], validRange):
                matchingRange = validRange
                break
        if matchingRange != None:
            validRanges.remove(matchingRange)
            newRange = [min(newRange[0], matchingRange[0]), max(newRange[1], matchingRange[1])]
        validRanges.append(newRange)
    else:
        validRanges.append(rule)
print(validRanges)

sum = 0
for value in nearby_tickets_values:
    sum += value
    for range in validRanges:
        if strictInsideRange(value, range):
            sum -= value
            break
print(sum)