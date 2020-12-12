def cidMissing(list):
    for el in list:
        if el[:3] == 'cid':
            return False
    return True

def validate(list):
    byr = int(list[0].split(':')[1]) >= 1920 and int(list[0].split(':')[1]) <= 2002
    if (len(list) == 8):
        ecl = list[2].split(':')[1] in ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']
        eyr = int(list[3].split(':')[1]) >= 2020 and int(list[3].split(':')[1]) <= 2030
        hcl = list[4].split(':')[1][0] == '#' and len(list[4].split(':')[1]) == 7
        hgt = (list[5].split(':')[1][-2:] == 'cm' and 150 <= int(list[5].split(':')[1][:-2]) and int(list[5].split(':')[1][:-2]) <= 193) or (list[5].split(':')[1][-2:] == 'in' and 59 <= int(list[5].split(':')[1][:-2]) and int(list[5].split(':')[1][:-2]) <= 76) 
        iyr = int(list[6].split(':')[1]) >= 2010 and int(list[6].split(':')[1]) <= 2020
        pid = len(list[7].split(':')[1]) == 9

        return byr and ecl and eyr and hcl and hgt and iyr and pid
    elif (len(list) == 7): 
        ecl = list[1].split(':')[1] in ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']
        eyr = int(list[2].split(':')[1]) >= 2020 and int(list[2].split(':')[1]) <= 2030
        hcl = list[3].split(':')[1][0] == '#' and len(list[3].split(':')[1]) == 7
        hgt = (list[4].split(':')[1][-2:] == 'cm' and 150 <= int(list[4].split(':')[1][:-2]) and int(list[4].split(':')[1][:-2]) <= 193) or (list[4].split(':')[1][-2:] == 'in' and 59 <= int(list[4].split(':')[1][:-2]) and int(list[4].split(':')[1][:-2]) <= 76) 
        iyr = int(list[5].split(':')[1]) >= 2010 and int(list[5].split(':')[1]) <= 2020
        pid = len(list[6].split(':')[1]) == 9

        return byr and ecl and eyr and hcl and hgt and iyr and pid

    return False

        

# boiler plate for input
f = open("i1.txt","r") 
input = f.read().split('\n\n')
length = len(input)
f.close()

count = 0
for i in range(length):
    passport = input[i].replace('\n', ' ').split(' ')
    passport.sort()
    if (len(passport) == 8 and validate(passport)):
        count += 1
    elif (len(passport) == 7 and cidMissing(passport) and validate(passport)):
        count += 1
print(count)