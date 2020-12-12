# boiler plate for input
f = open("i1.txt","r") 
input = list(map(int,  f.read().split('\n')))
length = len(input)

# goes through list and checks for i + j == 2020, if so prints mult and breaks
for i in range(length):
    for j in range(i + 1, length):
        if (input[i] + input[j] == 2020): 
            print(input[i] * input[j])
            break

f.close()