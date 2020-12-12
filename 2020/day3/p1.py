def split(word):
    return [char for char in word]  

# boiler plate for input
f = open("i1.txt","r") 
input = list(map(split, f.read().split('\n')))
length = len(input)
f.close()


trees = 0
x = 0
y = 0
while len(input) > y:
    if (input[y][x % len(input[y])] == '#'):
        trees += 1
    y += 1
    x += 3 
print(trees)