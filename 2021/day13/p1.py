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

    for fold in folds[0:1]:
        coordIndex = 0 if fold[0] == 'x' else 1
        foldValue = int(fold[1])
        for coordset in coords:
            if coordset[coordIndex] > foldValue:
                diff = coordset[coordIndex] - foldValue
                coordset[coordIndex] = foldValue - diff

    set = {}
    for coordset in coords:
        coordtuple = tuple(coordset)
        set.setdefault(coordtuple, 0)
        set[coordtuple] += 1

    print(len(set))
    