import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n\n')
f.close()

p1Deck = input[0].split('\n')[1:]
p2Deck = input[1].split('\n')[1:]

def combat(p1Deck, p2Deck, gameNumber):
    games = set()
    if (gameNumber == 1):
        print('=== Game of depth ' + str(gameNumber) + ' ===')
    roundCounter = 1
    while (len(p1Deck) > 0 and len(p2Deck) > 0):
        keyString = ' '.join(p1Deck) + ' | ' + ' '.join(p2Deck)
        if keyString in games:
            if (gameNumber == 1):
                print("Player 1 wins due to this game being played before")
            return 1
        else:
            games.add(keyString)
        if (gameNumber == 1):
            print('\n-- Round ' + str(roundCounter) + ' (Game of depth ' + str(gameNumber) + ') --')
            print('Player 1\'s deck: ' + ', '.join(p1Deck))
            print('Player 2\'s deck: ' + ', '.join(p2Deck))

        p1Card = p1Deck.pop(0)
        p2Card = p2Deck.pop(0)

        if (gameNumber == 1):
            print('Player 1 plays: ' + p1Card)
            print('Player 2 plays: ' + p2Card)

        if (len(p1Deck) >= int(p1Card) and len(p2Deck) >= int(p2Card)):
            if (gameNumber == 1):
                print("Playing a sub-game to determine the winner...\n")
            winner = combat(p1Deck[:int(p1Card)], p2Deck[:int(p2Card)], gameNumber + 1)
            if (gameNumber == 1):
                print("\n...anyway, back to game of depth " + str(gameNumber) + ".")
        else:
            winner = (1, 2)[int(p1Card) < int(p2Card)]

        if (gameNumber == 1):
            print('Player ' + str(winner) + ' wins round ' + str(roundCounter) + ' of game of depth ' + str(gameNumber) + '!')

        if winner == 1:
            p1Deck += [p1Card, p2Card]
        else:
            p2Deck += [p2Card, p1Card]

        roundCounter += 1
    winner = (2, 1)[len(p1Deck) > 0]
    if (gameNumber == 1):
        print("The winner of game of depth " + str(gameNumber) + " is player " + str(winner) + "!")
    return winner

combat(p1Deck, p2Deck, 1)

print('\n== Post-game results ==')
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