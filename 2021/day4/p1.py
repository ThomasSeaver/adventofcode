def formatBoard(board):
    board = map(lambda r: map(lambda s: str(s), r), board)
    board = map(lambda r: ' '.join(r), board)
    board = '\n'.join(board)
    return board

class Spot:
    def __init__(self, val):
        self.val = val
        self.marked = False

    def __repr__(self):
        return "[val: {}, marked: {}]".format(self.val, self.marked)


input = ''

with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

calls = list(map(lambda x: int(x), input[0].split(',')))

boards = []
for index in range(1, len(input), 6):
    board = input[index + 1: index + 6]
    board = list(map(lambda s: filter(lambda r: len(r) != 0, s.split()), board))
    board = list(map(lambda r: list(map(lambda e: Spot(int(e)), r)), board))
    boards.append(board)

winningBoard = -1
for call in calls:
    # make call
    for boardIndex in range(len(boards)):
        for rowIndex in range(len(boards[0])):
            for spotIndex in range(len(boards[0][0])):
                if boards[boardIndex][rowIndex][spotIndex].val == call:
                    boards[boardIndex][rowIndex][spotIndex].marked = True

    # check winner
    for boardIndex in range(len(boards)):
        for rowIndex in range(len(boards[0])):
            if len(filter(lambda s: s.marked, boards[boardIndex][rowIndex])) == 5:
                print('board won')
                print(formatBoard(board))
                winningBoard = boardIndex
                
    for boardIndex in range(len(boards)):
        for index in range(len(board[0])):
            if len(filter(lambda r: r[index].marked, boards[boardIndex])) == 5:
                print('board won')
                print(formatBoard(boards[boardIndex]))
                winningBoard = boardIndex

    if winningBoard != -1:
        sum = 0
        for row in boards[winningBoard]:
            for spot in row:
                if not spot.marked:
                    sum += spot.val
        print(sum * call)
        break


