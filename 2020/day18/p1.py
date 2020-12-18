import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
f.close()

def handleExpression(a, op, b):
    if op == '*':
        return a * b
    elif op == '+':
        return a + b

def handleLine(line):
    # have to handle parens
    count = 0
    startList = []
    endList = []

    # Go through and collect all top level paren sets
    for i, char in enumerate(line):
        if char == '(':
            if count == 0:
                startList.append(i)
            count += 1
        elif char == ')':
            count -= 1
            if count == 0:
                endList.append(i)

    # If we have paren sets in here, go through and call this function on them so we have just the rseult value
    if len(startList) > 0:
        newLine = ""
        lastEnd = 0
        for i in range(len(startList)):
            newLine += line[lastEnd:startList[i]]
            newLine += str(handleLine(line[startList[i] + 1: endList[i]]))
            lastEnd = endList[i] + 1
        newLine += line[lastEnd:]
        line = newLine

    # split list up, take the first value in it
    values = line.split(' ')
    res = int(values.pop(0))

    # for each value, take two subsequent values as oprator and argument and get the resulting value, save back to subres
    while (len(values) > 0):
        op = values.pop(0)
        arg = int(values.pop(0))
        res = handleExpression(res, op, arg)
    return res


res = 0
# For line of homework in input
for line in input:
    # sum these results
    res += handleLine(line)

# return sum
print(res)
