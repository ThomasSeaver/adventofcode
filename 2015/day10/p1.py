import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read()
length = len(input)
f.close()

curStr = input
for i in range(40):
    ar = []
    cur = ''
    count = 0
    for char in curStr:
        if cur == '':
            cur =  char
            count = 1
        elif cur == char:
            count += 1
        elif cur != char:
            ar.append((count, cur))
            cur = char
            count = 1
    ar.append((count, cur))

    curStr = ""
    for x in ar:
        curStr += str(x[0]) + x[1]
print(len(curStr))