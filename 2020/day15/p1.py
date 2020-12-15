# boiler plate for input
f = open("i1.txt","r") 
input = list(map(int, f.read().split(',')))
length = len(input)
f.close()

for i in range (length, 2020):
    lastNumSpoken = input[len(input) - 1]
    dist = 0
    for i in reversed(range(len(input) - 1)):
        if input[i] == lastNumSpoken:
            dist = len(input) - (i + 1)
            break
    input.append(dist)

print(input[len(input) - 1])