with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

octos = list(map(lambda x: list(map(lambda y: {'energy': int(y), 'flashed': False}, list(x))), input))

surroundingSpaces = [{'x': x, 'y': y} for x in range(-1, 2) for y in range(-1, 2)]

def flash(y, x):
    octos[y][x]['flashed'] = True
    
    for space in surroundingSpaces:
        xMod = x + space['x']
        yMod = y + space['y']
        if xMod >= 0 and xMod < len(octos[0]) and yMod >= 0 and yMod < len(octos):
            adjacentOcto = octos[yMod][xMod]
            adjacentOcto['energy'] += 1
            if (adjacentOcto['energy'] > 9 and not adjacentOcto['flashed']):
                flash(yMod, xMod)


flashes = 0
for step in range(100):
    # increase each by 1
    for row in octos:
        for index, octo in enumerate(row):
            octo['energy'] += 1

    # flash each
    for rowIndex, row in enumerate(octos):
        for octoIndex, octo in enumerate(row):
            if (octo['energy'] > 9 and not octo['flashed']):
                flash(rowIndex, octoIndex)

    # reset flashed
    for row in octos:
        for octoIndex, octo in enumerate(row):
            if octo['flashed']:
                flashes += 1
                octo['flashed'] = False
                octo['energy'] = 0
print(flashes)

