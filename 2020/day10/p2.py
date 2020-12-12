# boiler plate for input
f = open("i1.txt","r") 
input = list(map(int, f.read().split('\n')))
length = len(input)
f.close()

input.sort()
input.insert(0, 0)
input.append(input[length] + 3)

length = len(input)

waysForward = [0 for x in range(length)]
waysForward[length - 1] = 1
for i in reversed(range(length - 1)):
    curNum = input[i]
    count = 0
    for j in range(i + 1, min(length, i + 4)):
        delta = input[j] - curNum
        if delta <= 3:
            count += waysForward[j]
    waysForward[i] = count


print(waysForward[0])