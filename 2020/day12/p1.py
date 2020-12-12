import math

# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()

Y = 0
X = 0
facing = 0
for inst in input:
    cmd = inst[:1]
    amt = int(inst[1:])
    if (cmd == 'L'):
        facing = (facing + (amt / 90)) % 4
    elif (cmd == 'R'):
        facing = (facing + (4 - (amt / 90))) % 4
    elif (cmd == 'F'):
        if facing == 0:
            X += amt
        elif facing == 1:
            Y += amt
        elif facing == 2:
            X -= amt
        elif facing == 3:
            Y -= amt
    elif (cmd == 'N'):
        Y += amt
    elif (cmd == 'S'):
        Y -= amt
    elif (cmd == 'E'):
        X += amt
    elif (cmd == 'W'):
        X -= amt
print(abs(Y) + abs(X))