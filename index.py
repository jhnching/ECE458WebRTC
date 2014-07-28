from flask import Flask
from flask import request
from flask import render_template
import json
import hashlib

app = Flask(__name__)
rooms = {}
class Room:
    users = {}

    def getUsers():
        return users
    
    def addUser(user):
        users.append(user)
        return
    
    def removeUser(user):
        users.remove(user)
        return


@app.route('/')
def index():
    return render_template('index.html'), 200

@app.route('/room/<roomid>')
def getRoomhtml(roomid = None):
    return render_template('room.html'), 200

@app.route('/r/<roomid>', methods=['POST'])
def enterRoom(roomid = None):
    #endpoint errors, fix later
    #check names
    alias = request.form['userAlias']
    secret = request.form['secret']

    if alias == None or secret == None:
        return render_template('page_not_found.html'), 404
    room = Room()
    rooms[roomid] = room
    if room == None :
        rooms[roomid] = Room()
    room.users[alias] = secret
    
    #for now
    return "True"

'''@app.route('/g/')
def getPeers():'''


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
