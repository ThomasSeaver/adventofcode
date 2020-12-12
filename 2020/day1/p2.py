# boiler plate for input
f = open("i1.txt","r") 
input = list(map(int,  f.read().split('\n')))
length = len(input)

# goes through list and checks for i + j + k== 2020, if so prints mult and breaks
for i in range(length):
    for j in range(i + 1, length):
        for k in range(j + 1, length):
            if (input[i] + input[j] + input[k] == 2020): 
                print(input[i] * input[j] * input[k])
                break

f.close()