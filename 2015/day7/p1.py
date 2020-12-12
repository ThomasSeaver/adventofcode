import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
length = len(input)
f.close()

class wire:
    def __init__(self, result, signal=None, A=None, cmd=None, B=None):
        self.result = result
        self.signal = signal
        self.A = A
        self.cmd = cmd
        self.B = B
        self.solved = (True, False)[signal == None]
    
    def __repr__(self):
        if self.solved:
            return self.result + " = " + self.signal
        elif self.cmd == None:
            return self.result + " = " + self.A
        elif self.B == None:
            return self.result + " = " + self.cmd + " " + self.A
        else:
            return self.result + " = " + self.A + " " + self.cmd + " " + self.B

def isInt(i):
    try: 
        int(i)
        return True
    except ValueError:
        return False

def gate(a, cmd=None, b=None):
    if (a[0:2] == '0b'):
        a = int(a, 2)
    else:
        a = int(a)
    if (cmd == None):
        return bin(a)
    if (cmd == 'NOT'):
        return bin(~a)
    b = int(b, 2)
    if (cmd == 'LSHIFT'):
        return bin(a << b)
    elif (cmd == 'RSHIFT'):
        return bin(a >> b)
    elif (cmd == 'AND'):
        return  bin(a & b)
    elif (cmd == 'OR'):
        return bin(a | b)

def parse(val):
    if val == None:
        return (True, val)
    elif val[0:2] == '0b':
        return (True, val)
    elif val.upper() == val:
        return (True, val)
    else:
        for x in ar:
            if x.result == val:
                if x.solved:
                    return (True, x.signal)
                else:
                    return (False, val)

ar = [0 for x in range(length)]
for i, x in enumerate(input):
    vals = x.split(' ')
    if (len(vals) == 3):
        if (isInt(vals[0])):
            sig = gate(vals[0])
            ar[i] = wire(vals[2], sig)
        else:
            ar[i] = wire(vals[2], None, vals[0])
    elif (len(vals) == 4):
        if (isInt(vals[1])):
            sig = gate(int(vals[1]), vals[0])
            ar[i] = wire(vals[2], sig)
        else:
            ar[i] = wire(vals[3], None, vals[1], vals[0])
    elif (len(vals) == 5):
        if (isInt(vals[0]) and isInt(vals[2])):
            sig = gate(int(vals[0]), vals[1], int(vals[2]))
            ar[i] = wire(vals[4], sig)
        elif (isInt(vals[0])):
            ar[i] = wire(vals[4], None, bin(int(vals[0])), vals[1], vals[2])
        elif (isInt(vals[2])):
            ar[i] = wire(vals[4], None, vals[0], vals[1], bin(int(vals[2])))
        else:
            ar[i] = wire(vals[4], None, vals[0], vals[1], vals[2])

print('\n'.join(map(str, ar)))

foundUnsolved = True
while(foundUnsolved):
    foundUnsolved = False
    for x in ar:
        if x.solved == False:
            foundUnsolved = True
            AOK = parse(x.A)
            cmdOK = parse(x.cmd)
            BOK = parse(x.B)
            
            if AOK[0] and cmdOK[0] and BOK[0]:
                x.signal = gate(AOK[1], cmdOK[1], BOK[1])
                x.solved = True

for x in ar:
    if x.result == 'a':
        print(int(x.signal, 2))