import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n\n')
f.close()

p1Deck = input[0].split('\n')[1:]
p2Deck = input[1].split('\n')[1:]
roundCounter = 1

while (len(p1Deck) > 0 and len(p2Deck) > 0):
    print('-- Round ' + str(roundCounter) + ' --')
    print('Player 1\'s deck: ' + ', '.join(p1Deck))
    print('Player 2\'s deck: ' + ', '.join(p2Deck))

    p1Card = p1Deck.pop(0)
    p2Card = p2Deck.pop(0)

    print('Player 1 plays: ' + p1Card)
    print('Player 2 plays: ' + p2Card)

    winner = (1, 2)[int(p1Card) < int(p2Card)]

    print('Player ' + str(winner) + ' wins the round!')
    print('\n')

    if winner == 1:
        p1Deck += [p1Card, p2Card]
    else:
        p2Deck += [p2Card, p1Card]

    roundCounter += 1

print('== Post-game results ==')
print('Player 1\'s deck: ' + ', '.join(p1Deck))
print('Player 2\'s deck: ' + ', '.join(p2Deck))

p1Score = 0
p2Score = 0

for count, val in enumerate(reversed(p1Deck)):
    p1Score += (count + 1) * int(val)

for count, val in enumerate(reversed(p2Deck)):
    p2Score += (count + 1) * int(val)

print('Player 1\'s score: ' + str(p1Score))
print('Player 2\'s score: ' + str(p2Score))