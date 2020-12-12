import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read()
length = len(input)
f.close()

num = 0
for x, i in enumerate(input):
    if i == '(':
        num += 1
    elif i == ')':
        num -= 1
    if num == -1:
        print(x + 1)