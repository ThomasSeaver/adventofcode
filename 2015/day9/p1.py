import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
length = len(input)
f.close()

def getPath(node, path):
    path.add(node.name)
    dist = 1000000
    for connection in node.connections:
        if connection[0].name not in path:
            testDist = int(connection[1]) + getPath(connection[0], path.copy())
            if testDist < dist:
                dist = testDist
    return (dist, 0)[dist == 1000000]

class Node:
    def __init__(self, name):
        self.name = name
        self.connections = []

    def __repr__(self):
        sumval = "\n"
        for x in self.connections:
            sumval += '\t' + x[0].name + '\n'
        return sumval

    def addConnection(self, pairedNode, dist):
        self.connections.append((pairedNode, dist))
        pairedNode.connections.append((self, dist))
    
cities = set(map(lambda x: x.split(' ')[0], input))
cities.add(input[len(input) - 1].split(' ')[2])
nodes = {}

for city in cities:
    nodes.update({city : Node(city)})

for connection in input:
    split = connection.split(' ')
    start = split[0]
    end = split[2]
    dist = split[4]
    nodes.get(start).addConnection(nodes.get(end), dist)

bestPath = 100000000
paths = []

for city in cities:
    newPath = getPath(nodes.get(city), set())
    paths.append(getPath(nodes.get(city), set()))
    if newPath < bestPath:
        bestPath = newPath

print(bestPath)
print(paths)
print(nodes)