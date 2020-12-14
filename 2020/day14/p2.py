# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()

def bitmask(val, mask):
    binary = bin(val)[2:].zfill(36)
    masked = ''
    for i, letter in enumerate(mask):
        if letter == '0':
            masked += binary[i]
        elif letter == '1':
            masked += '1'
        else:
            masked += 'X'
    addrList = [masked]
    newList = [masked]
    while len(newList) > 0:
        newList = []
        for addr in addrList:
            for i in range(len(addr)):
                if (addr[i] == 'X'):
                    newList.append(addr[:i] + '0' + addr[i + 1:])
                    newList.append(addr[:i] + '1' + addr[i + 1:])
                    break
        if newList != []:
            addrList = newList

    return addrList

mem = []

mask = '000000000000000000000000000000000000'

for line in input:
    if line[:4] == 'mask':
        mask = line[7:]
    else:
        addr = int(line.split('] = ')[0][4:])
        val = int(line.split('= ')[1])
        addrList = bitmask(addr, mask)
        for x in addrList:
            found = False
            newaddr = int('0b' + x, 2)
            for i in range(len(mem)):
                if mem[i][0] == newaddr:
                    mem[i][1] = val
                    found = True
                    break
            if not found:
                mem.append([newaddr, val])
sum = 0
for val in mem:
    sum += val[1]
print(sum)