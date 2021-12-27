with open('i.txt') as f:
    lines = f.readlines()
    input = list(map(lambda x: x.strip(), lines))

lanternFish = list(map(int, input[0].split(',')))

print(lanternFish)

days = 80

for day in range(days):
    newAr = []
    for fish in lanternFish:
        if (fish == 0):
            newAr.append(6)
            newAr.append(8)
        else:
            newAr.append(fish - 1)
    lanternFish = newAr
    
print(len(lanternFish))