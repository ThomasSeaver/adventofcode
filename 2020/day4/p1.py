def cidMissing(list):
    for el in list:
        if el[:3] == 'cid':
            return False
    return True

# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n\n')
length = len(input)
f.close()

count = 0
for i in range(length):
    if (len(input[i].replace('\n', ' ').split(' ')) == 8):
        count += 1
    elif (len(input[i].replace('\n', ' ').split(' ')) == 7 and cidMissing(input[i].replace('\n', ' ').split(' '))):
        count += 1
print(count)