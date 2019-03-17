from flask import Flask, request, render_template, redirect, url_for
import json

app = Flask(__name__)

rooms = [123]
roomDatas = {"123":[]}
killDatas = {"123": -1} # stores the value of nextIdx when kill last happened, indexing in to roomDatas is nextIdx - lastKilledIdx + 1 

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
    roomNumber = str(request.json["roomNumber"])
    adjustedNextIdx = nextIdx - killDatas[roomNumber] + 1 
    print("getData after {} (adjusted) from room {}".format(adjustedNextIdx, roomNumber))
    if adjustedNextIdx < 0: 
        return json.dumps(False)
    else:
        return json.dumps(roomDatas[roomNumber][adjustedNextIdx:])

@app.route('/putData', methods=('POST',))
def putData():
    roomNumber = str(request.json["roomNumber"])
    global roomDatas
    roomDatas[roomNumber].append(request.json["sendQueue"])
    print("putData from room {}".format(roomNumber))
    return json.dumps(None)

@app.route('/joinRoom', methods=('POST',))
def joinRoom():
    proposedRoom = request.form['roomNumber']
    global rooms, roomDatas
    try:
        proposedRoom = int(proposedRoom)
        if proposedRoom in rooms:
            print("joinRoom success for room {}".format(proposedRoom))
            return redirect(url_for("room", value=proposedRoom))
        else:
            print("failed joinRoom")
            return redirect(url_for('index',value="Fail"))
    except:
        print("failed joinRoom")
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
            print("createRoom {}\n\n\n".format(proposedRoom))
            return redirect(url_for("room",value=proposedRoom))
        else:
            print("createRoom failed")
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
    print("killBoard from room {} after the point {}".format(roomNumber, nextIdx))
    roomDatas[roomNumber] = []
    killDatas[roomNumber] = nextIdx
    return json.dumps(None)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
