with open('i.txt') as f:
    lines = f.readlines()
    inputs = ''.join(lines).split('\n***\n')
    inputs = list(map(lambda x: x.split('\n'), inputs))

for input in inputs:
    nodes = {}
    paths = []
    for line in input:
        split = line.split('-')

        if split[0] in nodes:
            nodes[split[0]]['attached'].append(split[1])
        else:
            nodes[split[0]] = {'attached': [split[1]]}


        if split[1] in nodes:
            nodes[split[1]]['attached'].append(split[0])
        else:
            nodes[split[1]] = {'attached': [split[0]]}

    def explore(node, visited):
        newVisited = visited.copy()
        newVisited.append(node)

        if node == 'end':
            paths.append(newVisited)
            return 1

        attached = nodes[node]['attached']

        sum = 0

        for attachedNode in attached:
            if attachedNode.isupper() or not attachedNode in visited:
                sum += explore(attachedNode, newVisited)
        
        return sum

    print(explore('start', []))