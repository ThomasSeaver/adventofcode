import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read()
length = len(input)
f.close()

num = 0
for x in input:
    if x == '(':
        num += 1
    elif x == ')':
        num -= 1
print(num)