# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()

# pretty much cheated on this second part because I'm braindead stupid and this required knowledge of literally the most random
# Chinese Remainder Theorem. I do not understand it but at least I will hopefully recognize it next time it comes up
pairs = []
for i, x in enumerate(input[1].split(',')):
    if x != 'x':
        pairs.append((int(x) - i, int(x)))

val = 1
for x, y in pairs:
    val *= y
total = 0
for x, y in pairs:
    z = val // y
    total += x * z * pow(z, y - 2, y)
    total = total % val
print(total)