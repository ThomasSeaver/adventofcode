# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()


valid = 0
for i in range(length):
    lower = int(input[i].split(':')[0].split(' ')[0].split('-')[0])
    upper = int(input[i].split(':')[0].split(' ')[0].split('-')[1])
    character  = input[i].split(':')[0].split(' ')[1]
    password   = input[i].split(':')[1].strip()

    lowerMatch = password[lower - 1] == character
    upperMatch = password[upper - 1] == character
    if (lowerMatch or upperMatch) and lowerMatch != upperMatch:
        valid += 1
print(valid)