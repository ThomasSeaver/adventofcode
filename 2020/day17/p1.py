import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read()
f.close()

def active(z, y, x, oldState):
    zO = z - 1
    yO = y - 1
    xO = x - 1
    if zO >= 0 and zO < len(oldState):
        if yO >= 0 and yO < len(oldState[0]):
            if xO >= 0 and xO < len(oldState[0][0]):
                return oldState[zO][yO][xO]
    return False


def countNeighbors(z, y, x, oldState):
    zO = z - 1
    yO = y - 1
    xO = x - 1

    count = 0
    for zM in range(-1, 2):
        zN = zM + zO
        if zN >= 0 and zN < len(oldState):
            for yM in range(-1, 2):
                yN = yM + yO
                if yN >= 0 and yN < len(oldState[0]):
                    for xM in range(-1, 2):
                        xN = xM + xO
                        isOrigin = (zM == 0 and yM == 0 and xM == 0)
                        if xN >= 0 and xN < len(oldState[0][0]) and not isOrigin:
                            if (oldState[zN][yN][xN]):
                                count += 1
    return count

# We have a 3d space of points, essentially
# These points, like bits, can be inactive or active
# And follow certain rules based on their past state, similar to conway's game of life
# ergo conway's cubes

# I would like to be able to get a count of what neighbors are active out of the potential neighbors
# And then iterate across said cubes from past state to get the order of new state
# the problem is that we may very well need to create an outer shell each time, increasing the depth of the struct


# First, we generate the state from our input
# Our space will be z containing y containing x, y initially being the columns, x being the rows of the input
oldState = [[[(True, False)[bit == '.'] for bit in row] for row in input.split('\n')]]

# Now we must loop 6 times
for i in range(6):
    print("\n\nCycle: " + str(i) + "\n")
    # Display current state
    for zLayer in range(len(oldState)):
        print ('z = ' + str(int(zLayer - (len(oldState) - 1) / 2)))
        for yLayer in oldState[zLayer]:
            print(''.join(list(map(lambda x : ('.', '#')[x], yLayer))))
        print('\n')

    # Each loop, we must take our old state, pad it, and examine each value inside, counting neighbors of this point within the old state
    paddedState = [
                    [
                        [False for xLayer in range(len(oldState[0][0]) + 2)
                    ] for yLayer in range(len(oldState[0]) + 2)
                ] for zLayer in range(len(oldState) + 2)]

    # Check each place in paddedState and check against our ruleset
    for z in range(len(paddedState)):
        for y in range(len(paddedState[0])):
            for x in range(len(paddedState[0][0])):
                count = countNeighbors(z, y, x, oldState)
                isActive = active(z, y, x, oldState)

                if isActive and (count == 2 or count == 3):
                    paddedState[z][y][x] = True
                elif isActive:
                    paddedState[z][y][x] = False
                elif count == 3:
                    paddedState[z][y][x] = True
    oldState = paddedState

# Now we go through and count active cubes
sum = 0
for z in range(len(oldState)):
    for y in range(len(oldState[0])):
        for x in range(len(oldState[0][0])):
            if oldState[z][y][x]:
                sum += 1
print(sum)