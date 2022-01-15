with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

chunkMapping = {'[': ']', '<': '>', '{': '}', '(': ')'}
pointsMapping = {']': 2, '>': 4, '}': 3, ')': 1}

points = []
for line in input:
    stack = []
    corrupt = False
    for charIndex in range(len(line)):
        char = line[charIndex]
        if char in ['[', '<', '{', '(']:
            stack.append(char)
        else:
            lastOpen = stack.pop()
            if char != chunkMapping[lastOpen]:
                corrupt = True
                break
    
    if not corrupt:
        stack = list(map(lambda x: chunkMapping[x], stack))
        stack.reverse()

        linePoints = 0
        for char in stack:
            linePoints *= 5
            linePoints += pointsMapping[char]
        points.append(linePoints)

points.sort()
print(points)
print(points[len(points) / 2])