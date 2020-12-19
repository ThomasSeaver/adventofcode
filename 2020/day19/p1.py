import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n\n')
    rules = input[0].split('\n')
    messages = input[1].split('\n')
f.close()

i = 0
solvedRules = {}
oldCount = 0
while 0 < len(rules) and oldCount != 2000: 
    if i == len(rules):
        oldCount += 1
        i = 0
    
    if '"' in rules[i]:
        num = rules[i].split(':')[0]
        letter = rules[i].split('"')[1]
        rules.pop(i)
        i -= 1
        solvedRules[num] = [letter]
    elif '|' not in rules[i]:
        constructed = [""]
        num = rules[i].split(': ')[0]
        vals = rules[i].split(': ')[1].split(' ')
        allHere = True
        for val in vals:
            if val in solvedRules.keys():
                ruleVal = solvedRules[val]
                newConstructed = []
                for k in range(len(ruleVal)):
                    for j in range(len(constructed)):
                        newConstructed.append(constructed[j] + ruleVal[k])
                constructed = newConstructed
            else:
                allHere = False 
                break

        if allHere:
            rules.pop(i)
            i -= 1
            solvedRules[num] = constructed
    else:
        num = rules[i].split(': ')[0]
        constructedleft = [""]
        valsleft = rules[i].split(': ')[1].split(' | ')[0].split(' ')
        allHere = True
        for val in valsleft:
            if val in solvedRules.keys():
                ruleVal = solvedRules[val]
                newConstructed = []
                for k in range(len(ruleVal)):
                    for j in range(len(constructedleft)):
                        newConstructed.append(constructedleft[j] + ruleVal[k])
                constructedleft = newConstructed
            else:
                allHere = False
                break
        if allHere:
            constructedright = [""]
            valsright = rules[i].split(': ')[1].split(' | ')[1].split(' ')
            for val in valsright:
                if val in solvedRules.keys():
                    ruleVal = solvedRules[val]  
                    newConstructed = []
                    for k in range(len(ruleVal)):
                        for j in range(len(constructedright)):
                            newConstructed.append(constructedright[j] + ruleVal[k])
                    constructedright = newConstructed
                else:
                    allHere = False
                    break
            if allHere:
                rules.pop(i)
                i -= 1
                solvedRules[num] = constructedleft + constructedright
    i += 1

zeroList = solvedRules['0']
count = 0
for message in messages:
    if message in zeroList:
        count += 1
print(count)