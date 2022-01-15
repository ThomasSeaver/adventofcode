with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

chunkMapping = {']': '[', '>': '<', '}': '{', ')': '('}
pointsMapping = {']': 57, '>': 25137, '}': 1197, ')': 3}

points = 0
for line in input:
    stack = []
    for char in line:
        if char in ['[', '<', '{', '(']:
            stack.append(char)
        else:
            lastOpen = stack.pop()
            if lastOpen != chunkMapping[char]:
                points += pointsMapping[char]
                break

print(points)