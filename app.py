from flask import Flask, request, render_template, redirect, url_for
import json

app = Flask(__name__)

rooms = [123]
roomDatas = {"123":[]}

@app.route('/')
@app.route('/index')
def index(val=""):
    return render_template("index.html",value=val)

@app.route('/test')
def test():
    return render_template("test.html")

@app.route('/getData', methods=('POST',))
def getData():
    lastIdx = int(request.json["lastIdx"])
    roomNumber = str(request.json["roomNumber"])
    import pdb; pdb.set_trace()
    print(json.dumps(roomDatas[roomNumber][lastIdx:]))
    return json.dumps(roomDatas[roomNumber][lastIdx:])

@app.route('/putData', methods=('POST',))
def putData():
    # how do you know what room they are in?
    print("sending DATA\n\n\n\n")
    roomNumber = str(request.json["roomNumber"])
    global roomDatas
    roomDatas[roomNumber].append(request.json["sendQueue"])
    print(roomDatas)
    return json.dumps(None)

@app.route('/joinRoom', methods=('POST',))
def joinRoom():
    proposedRoom = request.form['roomNumber']
    global rooms, roomDatas
    try:
        proposedRoom = int(proposedRoom)
        if proposedRoom in rooms:
            return redirect(url_for("room", value=proposedRoom))
        else:
            return redirect(url_for('index',value="Fail"))
    except:
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
            print("CREATER{}\n\n\n".format(proposedRoom))
            return redirect(url_for("room",value=proposedRoom))
        else:
            return redirect(url_for('index',value="Fail"))
    except:
        return redirect(url_for('index',value="Fail"))

@app.route('/room')
def room():
    return render_template("room.html")

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
