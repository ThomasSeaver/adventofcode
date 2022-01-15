import string

with open('i.txt') as f:
    lines = f.readlines()
    inputs = ''.join(lines).split('\n***\n')
    inputs = list(map(lambda x: x.split('\n'), inputs))

for input in inputs:
    parsing = '\n'.join(input).split('\n---\n')
    template = parsing[0]
    pairs = parsing[1]
    pairs = list(map(lambda x: x.strip().split(' -> '), pairs.split('\n')))


    for i in range(40):
        newTemplate = ''
        for charIndex in range(len(template) - 1):
            newTemplate += template[charIndex]

            pair = ''.join(template[charIndex : charIndex + 2])
            addition = [x for x in pairs if x[0] == pair][0][1]
            newTemplate += addition
        newTemplate += template[-1]
        template = newTemplate

    counts = list(map(lambda x: template.count(x),list(string.ascii_uppercase)))
    counts = [i for i in counts if i != 0]

    print(max(counts) - min(counts))
    