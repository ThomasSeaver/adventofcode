import statistics

with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

crabs = list(map(int, input[0].split(',')))

median = statistics.median(crabs)

print(sum(abs(x - median) for x in crabs))