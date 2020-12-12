# boiler plate for input
f = open("i1.txt","r") 
input = list(map(int, f.read().split('\n')))
length = len(input)
f.close()

found = -1
for i in range(length):
    small = i
    big = i
    
    for j in range(i + 1, length):
        if (input[j] < input[small]):
            small = j
        elif (input[j] > input[big]):
            big = j

        sumNum = sum(input[i:j + 1])
        if sumNum == 25918798:
            found = input[small] + input[big]
            break
        elif sumNum > 25918798:
            break

    if not found == -1:
        print(found)
        break