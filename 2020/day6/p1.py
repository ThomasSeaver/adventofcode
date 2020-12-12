# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n\n')
length = len(input)
f.close()

total = 0
for group in input:
    questionnaire = [0 for x in range(26)]
    group = ''.join(group.split('\n'))
    for letter in group:
        letter = ord(letter) - 97
        questionnaire[letter] = (questionnaire[letter], 1)[questionnaire[letter] == 0]
    
    count = 0
    for num in questionnaire:
        count += num
    total += count
print(total)
