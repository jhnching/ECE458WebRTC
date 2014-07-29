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
        return json.dumps({'state':False})
    room.users[alias] = secret
    #for now
    js = copy.copy(room.users)
    js.pop(alias, None)
    js['state']=True
    return json.dumps(js)


@app.route('/getPeers')
def getPeers():
    alias = request.form['userAlias']
    roomid = request.form['room']
    return json.dumps(copy(rooms[roomid].users).pop(alias, None))

@app.route('/deleteSelf')
def deleteSelf():
    alias = request.form['userAlias']
    roomid = request.form['room']
    room = rooms.get(roomid, None)
    if room != None:
        if room.users.pop(alias, None) != None:
            return json.dumps({'state':True})
    return json.dumps({'state':False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
