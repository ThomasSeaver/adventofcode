# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()

ranCount = [0 for x in range(length)]

instCounter = 0
acc = 0
while True:
    ranCount[instCounter] += 1
    if (ranCount[instCounter] == 2):
        break

    cmd = input[instCounter].split(' ')[0]

    if cmd == 'nop':
        instCounter += 1
    else:
        num = int(input[instCounter].split(' ')[1])
        if cmd == 'acc':
            acc += num
            instCounter += 1
        elif cmd == 'jmp':
            instCounter += num

print(acc)
            

