from flask import Flask, request, render_template, redirect, url_for
import json

app = Flask(__name__)

rooms = [123]
roomDatas = {"123":[]}
killDatas = {"123": -1} # stores the value of nextIdx - 1 when kill last happened, indexing in to roomDatas is nextIdx - killDatas[roomNumber] - 1 

@app.route('/')
@app.route('/index')
def index(val=""):
    return render_template("index.html",value=val)

@app.route('/test')
def test():
    return render_template("test.html")

@app.route('/getData', methods=('POST',))
def getData():
    nextIdx = int(request.json["nextIdx"])
    lastKillIdx = int(request.json["lastKillIdx"])
    roomNumber = str(request.json["roomNumber"])
    adjustedNextIdx = nextIdx - killDatas[roomNumber] - 1 
    if lastKillIdx != killDatas[roomNumber]:
        print("\n\n\n\n\n\n\nSUPER IMPORTANT do not take this lightly \n\n\n\n\n\n\n\n\n")
        return json.dumps(False)
    else:
        return json.dumps(roomDatas[roomNumber][adjustedNextIdx:])

@app.route('/putData', methods=('POST',))
def putData():
    roomNumber = str(request.json["roomNumber"])
    global roomDatas
    roomDatas[roomNumber].append(request.json["sendQueue"])
    print("\tputData from room {}".format(roomNumber))
    return json.dumps(None)

@app.route('/getNextIdx', methods=('POST',))
def getNextIdx():
    roomNumber = str(request.json["roomNumber"])
    return json.dumps(killDatas[roomNumber]+1)

@app.route('/joinRoom', methods=('POST',))
def joinRoom():
    proposedRoom = request.form['roomNumber']
    global rooms, roomDatas
    try:
        proposedRoom = int(proposedRoom)
        if proposedRoom in rooms:
            print("\tjoinRoom success for room {}".format(proposedRoom))
            return redirect(url_for("room", value=proposedRoom))
        else:
            print("\tfailed joinRoom")
            return redirect(url_for('index',value="Fail"))
    except:
        print("\tfailed joinRoom")
        return redirect(url_for('index',value="Fail"))

@app.route('/createRoom', methods=('POST',))
def createRoom():
    proposedRoom = request.form["roomNumber"]
    global rooms, roomDatas
    try:
        proposedRoom = int(proposedRoom)
        if proposedRoom not in rooms:
            rooms.append(proposedRoom)
            roomDatas[str(proposedRoom)] = []
            killDatas[str(proposedRoom)] = -1
            print("\tcreateRoom {}\n\n\n".format(proposedRoom))
            return redirect(url_for("room",value=proposedRoom))
        else:
            print("\tcreateRoom failed")
            return redirect(url_for('index',value="Fail"))
    except:
        return redirect(url_for('index',value="Fail"))

@app.route('/room')
def room():
    return render_template("room.html")

@app.route('/killBoard', methods=('POST',))
def killBoard():
    roomNumber = str(request.json["roomNumber"])
    nextIdx = request.json["nextIdx"]
    print("\tkillBoard from room {} after the point {}".format(roomNumber, nextIdx))
    roomDatas[roomNumber] = []
    killDatas[roomNumber] = nextIdx - 1
    return json.dumps(None)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')

