# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()


lastExecuted = False

for i in range(length):
    mainCmd = input[i].split(' ')[0]
    if mainCmd != 'acc':
        mainNum = str(input[i].split(' ')[1])
        if mainCmd == 'nop':
            input[i] = 'jmp ' + mainNum
        elif mainCmd == 'jmp':
            input[i] = 'nop ' + mainNum

        instCounter = 0
        acc = 0
        ranCount = [0 for x in range(length)]
        while True:
            if (instCounter == length):
                lastExecuted = True
                break
            
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
            
        mainCmd = input[i].split(' ')[0]
        if mainCmd == 'nop':
            input[i] = 'jmp ' + mainNum
        elif mainCmd == 'jmp':
            input[i] = 'nop ' + mainNum

        if (lastExecuted):
            print(acc)
            break
            

