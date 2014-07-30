from flask import Flask
from flask import request
from flask import render_template
import json
import hashlib
import copy

app = Flask(__name__)
rooms = {}
class Room:
    def __init__(self):
        self.users = {}

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
    a = room.users.get(alias, None) 
    if a != None:
        return json.dumps({'state':False, 'message':'Username exists'})
    if len(room.users) >= 2:
        return json.dumps({'state':False, 'message':'Room full'})
    room.users[alias] = secret
    #for now
    js = copy.copy(room.users)
    js.pop(alias, None)
    obj = {'state' : True, 'data' : js}
    return json.dumps(obj)


@app.route('/getPeers')
def getPeers():
    alias = request.form['userAlias']
    roomid = request.form['room']
    return json.dumps(copy.copy(rooms[roomid].users).pop(alias, None))

@app.route('/deleteUserFromRoom' , methods=['POST'])
def deleteUserFromRoom():
    other = request.form['disconnectOther']
    alias = request.form['userAlias']
    roomid = request.form['roomid']
    room = rooms.get(roomid, None)
    if room != None:
        
        self = room.users.pop(alias, None)
        print self
        print other
        print room.users
        if  self != None:
            if other == 'true':
                print 'here'
                room.users.clear()
                room.users[alias] = self
            print room.users
            return json.dumps({'state':True})
    return json.dumps({'state':False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
