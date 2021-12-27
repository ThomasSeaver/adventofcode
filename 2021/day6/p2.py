with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))


produced = {}
def getProduced(num):
    if (num < 0):
        return 1
    elif num in produced:
        return produced[num]
    else:
        res = getProduced(num - 9) + getProduced(num - 7)
        produced[num] = res
        return res

lanternFish = list(map(int, input[0].split(',')))

print(lanternFish)

days = 257

for day in range(days):
    sum = 0
    for fish in lanternFish:
        sum += getProduced(day - fish - 1)
    print(day, sum)

