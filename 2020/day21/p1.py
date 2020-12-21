import sys

# boiler plate for input
with open(sys.argv[1], 'r') as f:
    input = f.read().split('\n')
f.close()

# Map allergens to their potential ingredients
allergenMap = dict()
allIngredients = []
for line in input:
    ingredients = line.split(' (')[0].split(' ')
    allIngredients += ingredients
    allergens = line.split('contains ')[1][:-1].split(', ')
    for allergen in allergens:
        if allergen in allergenMap:
            oldPotentials = allergenMap.get(allergen)
            newPotentials = []
            for ingredient in ingredients:
                if ingredient in oldPotentials:
                    newPotentials.append(ingredient)
            allergenMap.update({allergen: newPotentials})
        else:
            allergenMap.update({allergen: ingredients})

# Reduce the allergen map
solvedAllergenMap = dict()
while len(allergenMap) > 0:
    allergensToRemove = []
    ingredientsToRemove = []
    for allergen, potentials in allergenMap.items():
        if len(potentials) == 1:
            solvedAllergenMap.update({allergen: potentials[0]})
            allergensToRemove.append(allergen)
            ingredientsToRemove.append(potentials[0])

    for allergen in allergensToRemove:
        allergenMap.pop(allergen)

    for allergen, potentials in allergenMap.items():
        for ingredient in ingredientsToRemove:
            if ingredient in potentials:
                potentials.remove(ingredient)
        allergenMap.update({allergen: potentials})

# count non-allergenic ingredients
solvedIngredients = solvedAllergenMap.values()
count = 0
for ingredient in allIngredients:
    if ingredient not in solvedIngredients:
        count += 1
print(count)