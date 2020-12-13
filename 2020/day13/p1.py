# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n')
length = len(input)
f.close()

time = int(input[0])
def sortFirst(val): 
    return val[0]  

ar = []

for x in input[1].split(','):
    if x != 'x':
        ar.append((int(x) - (time % int(x)), int(x)))

print(ar)
ar.sort(key = sortFirst)
print(ar[0][0] * ar[0][1])