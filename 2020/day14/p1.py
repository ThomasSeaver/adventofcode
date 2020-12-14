# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()

def bitmask(val, mask):
    binary = bin(val)[2:]
    res = ''
    for i, letter in enumerate(mask):
        j = i - (len(mask) - len(binary))
        if j >= 0:
            if letter == 'X':
                res += binary[j]
            else:
                res += letter
        else:
            if letter == 'X':
                res += '0'
            else:
                res += letter
    res = '0b' + res
    return int(res, 2)

mem = [0 for x in range(70000)]

mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

for line in input:
    if line[:4] == 'mask':
        mask = line[7:]
    else:
        addr = int(line.split('] = ')[0][4:])
        val = int(line.split('= ')[1])
        mem[addr] = bitmask(val, mask)
sum = 0
for val in mem:
    if val != 0:
        print(val)
    sum += val
print(sum)