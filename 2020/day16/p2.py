import sys

def process_rule(rule):
    ruleName = rule.split(': ')[0]
    rule = rule.split(': ')[1]
    rule = rule.split(' or ')
    rule[0] = list(map(int, rule[0].split('-')))
    rule[1] = list(map(int, rule[1].split('-')))
    rule.append(ruleName)
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
    rules = list(map(process_rule, input[0].split('\n')))
    my_ticket = list(map(int, input[1].split('\n')[1].split(',')))
    nearby_tickets = [list(map(int,x.split(','))) for x in input[2].split('\n')[1:]]
f.close()

validRanges = [rules[0][0], rules[0][1]]

for i in range(1, len(rules)):
    for j in range(2):
        rule = rules[i][j]
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

valid_tickets = []
for ticket in nearby_tickets:
    invalid = False
    for value in ticket:
        invalid_value = True
        for validRange in validRanges:
            if strictInsideRange(value, validRange):
                invalid_value = False
                break
        if invalid_value:
            invalid = True
            break
    if not invalid:
        valid_tickets += [ticket]

print(valid_tickets)

unknown_positions = [[x] for x in range(len(my_ticket))]
print(rules)
print(unknown_positions)
oldRulesLen = 0

while (len(rules) > 0 and oldRulesLen != len(rules)):
    oldRulesLen = len(rules)
    for position in unknown_positions:
        if len(position) == 1:
            potential_rules = rules.copy()
            for ticket in valid_tickets:
                ticket_value = ticket[position[0]]
                for rule in potential_rules:
                    if not (strictInsideRange(ticket_value, rule[0]) or strictInsideRange(ticket_value, rule[1])):
                        potential_rules.remove(rule)
            if len(potential_rules) == 1:
                unknown_positions[unknown_positions.index(position)].append(potential_rules[0][2])
                rules.remove(potential_rules[0])

print(rules)
print(unknown_positions)

sum = 1
for position in unknown_positions:
    if 'departure' in position[1]:
        sum *= my_ticket[position[0]]
print(sum)