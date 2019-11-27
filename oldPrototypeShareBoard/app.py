from flask import Flask, request, render_template
import json

data = []
deadStr = json.dumps(None)
app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/sendData', methods=("POST",))
def sendData():
	lastIdx = request.json
	return json.dumps(data[lastIdx:])

@app.route('/putMassData', methods=("POST",))
def putMassData():
    global data
    data += request.json
    return deadStr

@app.route('/putData', methods=("POST",))
def putData():
    print(data)
    data.append(request.json)
    return json.dumps(None)

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0')

