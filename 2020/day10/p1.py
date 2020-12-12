# boiler plate for input
f = open("i1.txt","r") 
input = list(map(int, f.read().split('\n')))
input.sort()
length = len(input)
f.close()

joltDifferences = [0, 0, 0, 1]
joltDifferences[input[0]] += 1
for i in range (1, length):
    diff = input[i] - input[i - 1]
    joltDifferences[diff] += 1

print(joltDifferences[1] * joltDifferences[3])