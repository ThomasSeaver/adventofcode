# boiler plate for input
f = open("i1.txt","r") 
input = list(map(int, f.read().split('\n')))
length = len(input)
f.close()

backLength = 25
for i in range(backLength, length):
    curNum = input[i]
    backSlice = input[i - backLength:i]
    found = False
    print(backSlice)
    for j in range(len(backSlice)):
        for k in range(j + 1, len(backSlice)):
            if (backSlice[j] + backSlice[k] == curNum):
                found = True
    if not found:
        print(input[i])
        break