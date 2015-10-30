
from flask import Flask, request, jsonify
from random import randint
import json

app = Flask(__name__)
numberOfPlayers = 2
animals = ["Bird","Cat", "Dog", "Penguin", "Rabbit", "Wolf"]
players = {}
currentTagged = ""
global gameMode
gameMode = 1

def assignName():
    n = randint(0, len(animals) - 1)
    name = animals[n]
    return name

# "Tags" a random player
def tagRandom():
    return players[randint(0, len(players) - 1)]

def updateCounter(player):
    for p in players.keys:
        if p == player:
            continue
        players[p] = players[p] + 1

def checkTimeout():
    for p in players.keys:
        # If there is no response from a player after 5 rounds, the player is removed
        if players[p] > 5:
            players.pop(p)

@app.route('/', methods = ["POST"])
def index():
    
    message = request.data
    print message
  
    if gameMode == 1:
        if len(players) == numberOfPlayers:
            currentTagged = tagRandom()
            global gameMode
	    gameMode = 2
        
        name = assignName()
        players[name] = 0
        return name
         

    elif gameMode == 2:
        checkTimeout()

        if message[0] == "TAG":
            # Resets timeout timer
            updateCounter(message[1])
            currentTagged = message[2]
        elif message[0] == "UPDATE":
            updateCounter(message[1])

        return currentTagged


if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 8001, threaded = True)

