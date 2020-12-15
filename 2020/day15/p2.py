# boiler plate for input
f = open("i1.txt","r") 
input = list(map(int, f.read().split(',')))
length = len(input)
f.close()

dictionary = {}

for i in range(length - 1):
    dictionary.update({input[i]: i + 1})

lastNum = input[length - 1]

for i in range (length - 1, 30000000 - 1):
    found = dictionary.get(lastNum)
    dictionary.update({lastNum : i + 1})

    if found != None:
        lastNum = i + 1 - found
    else:
        lastNum = 0

print(lastNum)