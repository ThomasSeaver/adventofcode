import statistics

with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

crabs = list(map(int, input[0].split(',')))

mean = statistics.mean(crabs)
if (mean % 1 != 0):
    high = sum((abs(x - (mean + 0.5)) * (abs(x - (mean + 0.5)) + 1)) / 2 for x in crabs)
    low  = sum((abs(x - (mean - 0.5)) * (abs(x - (mean - 0.5)) + 1)) / 2 for x in crabs)
    print(high)
    print(low)
else:
    print(sum((abs(x - mean) * (abs(x - mean) + 1)) / 2 for x in crabs))