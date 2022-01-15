with open('i.txt') as f:
    lines = f.readlines()
    inputs = ''.join(lines).split('\n***\n')
    inputs = list(map(lambda x: x.split('\n'), inputs))

for input in inputs:
    parsing = '\n'.join(input).split('\n---\n')
    coords = parsing[0]
    coords = list(map(lambda x: x.strip().split(','), coords.split('\n')))
    coords = list(map(lambda x: list(map(int, x)), coords))
    folds = parsing[1]
    folds = list(map(lambda x: x.strip().split(' ')[2].split('='), folds.split('\n')))

    for fold in folds:
        coordIndex = 0 if fold[0] == 'x' else 1
        foldValue = int(fold[1])
        for coordset in coords:
            if coordset[coordIndex] > foldValue:
                diff = coordset[coordIndex] - foldValue
                coordset[coordIndex] = foldValue - diff

    maxX = 0
    maxY = 0
    for coordset in coords:
        if maxX <= coordset[0]:
            maxX = coordset[0] + 1
        if maxY <= coordset[1]:
            maxY = coordset[1] + 1

    image = [ ['.']*maxX for i in range(maxY)]

    for coordset in coords:
        image[coordset[1]][coordset[0]] = '#'
    print('\n'.join(list(map(lambda x: ''.join(x), image))))
    