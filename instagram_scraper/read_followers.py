import csv
import re
# import argv

# script, filename = argv

# def is_username(username):
    # return not username.startswith('http') and not username.startswith('www') and username != 'false' and ' ' not in username and username != 'true' and not username.isdigit() and username

def is_username(username):
    return re.match("^(?!_)\w{3,15}$", username) and username != 'true' and username != 'false' and not username.isdigit()

def num_there(s):
    return any(i.isdigit() for i in s)

saved_usernames = open('9.txt', 'w')
usernames = []
with open('9.csv', 'rb') as csvfile:
     csvreader = csv.reader(csvfile, delimiter=',')
     for row in csvreader:
         for line in row:
            if is_username(line) and line not in usernames:
                usernames.append(line)
                saved_usernames.write(line+'\n')

print len(usernames)
