from flask import Flask
from flask import request
from flask import render_template
import json
import hashlib
import copy

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
    secret = request.form['id']

    if alias == None or secret == None:
        return render_template('page_not_found.html'), 404
    
    if rooms.get(roomid, None) == None :
        rooms[roomid] = Room()

    room = rooms[roomid];
    if room.users.get(alias, None) != None:
        return "False"
    room.users[alias] = secret
    #for now
    js = copy.copy(room.users)
    js.pop(alias, None)
    return json.dumps(js)


@app.route('/getPeers')
def getPeers():
    alias = request.form['userAlias']
    roomid = request.form['room']
    return json.dumps(copy(room[roomid].users).pop(alias, None))



if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
