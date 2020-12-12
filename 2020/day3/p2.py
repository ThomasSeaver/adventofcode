def split(word):
    return [char for char in word]  

# boiler plate for input
f = open("i1.txt","r") 
input = list(map(split, f.read().split('\n')))
length = len(input)
f.close()

total = 1

trees = 0
x = 0
y = 0
while len(input) > y:
    if (input[y][x % len(input[y])] == '#'):
        trees += 1
    y += 1
    x += 1 
total *= trees

trees = 0
x = 0
y = 0
while len(input) > y:
    if (input[y][x % len(input[y])] == '#'):
        trees += 1
    y += 1
    x += 3 
total *= trees

trees = 0
x = 0
y = 0
while len(input) > y:
    if (input[y][x % len(input[y])] == '#'):
        trees += 1
    y += 1
    x += 5 
total *= trees

trees = 0
x = 0
y = 0
while len(input) > y:
    if (input[y][x % len(input[y])] == '#'):
        trees += 1
    y += 1
    x += 7 
total *= trees

trees = 0
x = 0
y = 0
while len(input) > y:
    if (input[y][x % len(input[y])] == '#'):
        trees += 1
    y += 2
    x += 1 
total *= trees


print(total)