# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n\n')
length = len(input)
f.close()

total = 0
for group in input:
    questionnaire = [0 for x in range(26)]
    groupString = ''.join(group.split('\n'))
    for letter in groupString:
        letter = ord(letter) - 97
        questionnaire[letter] = questionnaire[letter] + 1
    
    count = 0
    for num in questionnaire:
        if (num == len(group.split('\n'))):
            count += 1
    total += count
    print(group)
    print(count)
print(total)
