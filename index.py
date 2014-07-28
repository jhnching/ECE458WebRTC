from flask import Flask
from flask import request
from flask import render_template
app = Flask(__name__)
rooms = []
class Room:
    users = []
    def __init__(self, roomid):
        self.roomid = roomid

    def getUsers():
        return users
    
    def addUser(user):
        users.append(user)
        return
    
    def removeUser(user):
        users.remove(user)
        return

class User:
    def __init__(self,name = "Anon", secret = ""):
        self.secret = secretr
        self.name = name

def getRoom(roomid = None):
    for room in rooms:
        if room.roomid == roomid:
            return room
    return None

@app.route('/')
def index():
    return render_template('index.html'), 200


@app.route('/r/<int:roomid>')
def enterRoom(roomid = None):
    #endpoint errors, fix later
    alias = request.args.get('userAlias')
    secret = request.args.get('secret')
    if alias == None or secret == None:
        return render_template('page_not_found.html'), 404
    user = User(alias, secret);
    room = getRoom(roomid)
    if room == None :
        room = Room(roomid)
    room.users.append(user)
    rooms.append(room)
    #for now
    return render_template('room.html', users = room.users), 200



if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
