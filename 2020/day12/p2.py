import math

# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()

Y = 0
X = 0
waypoint = [10, 1]
for inst in input:
    cmd = inst[:1]
    amt = int(inst[1:])
    if (cmd == 'L' or cmd == 'R'):
        angle = (amt / 90)
        if cmd =='R':
            angle = 4 - angle

        if angle == 1:
            waypoint = [-1 * waypoint[1], waypoint[0]]
        elif angle == 2:
            waypoint = [-1 * waypoint[0], -1 * waypoint[1]]
        elif angle == 3:
            waypoint = [waypoint[1], -1 * waypoint[0]]
            
    elif (cmd == 'F'):
        Y += waypoint[1] * amt
        X += waypoint[0] * amt
    elif (cmd == 'N'):
        waypoint[1] += amt
    elif (cmd == 'S'):
        waypoint[1] -= amt
    elif (cmd == 'E'):
        waypoint[0] += amt
    elif (cmd == 'W'):
        waypoint[0] -= amt
print(abs(Y) + abs(X))