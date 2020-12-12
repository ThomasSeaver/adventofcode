# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()


valid = 0
for i in range(length):
    lowerBound = int(input[i].split(':')[0].split(' ')[0].split('-')[0])
    upperBound = int(input[i].split(':')[0].split(' ')[0].split('-')[1])
    character  = input[i].split(':')[0].split(' ')[1]
    password   = input[i].split(':')[1].strip()

    count = 0
    for letter in password:
        if letter == character:
            count += 1
    if lowerBound <= count and count <= upperBound:
        valid += 1
print(valid)