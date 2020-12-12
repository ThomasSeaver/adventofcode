import sys
import hashlib

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read()
length = len(input)
f.close()

found = False
num = 1
while not found:
    value = input + str(num)
    encoded = hashlib.md5(value.encode())

    if (encoded.hexdigest()[:6] == '000000'):
        found = True
        print(num)
    else:
        num += 1 
