from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit, send
from flask_cors import CORS
import json
import os
from threading import Lock
from apscheduler.schedulers.background import BackgroundScheduler
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
cors = CORS(app)

class AlarmSoundDB:
    def __init__(self):
        self.__path = './alarms.db'
        self.__db = {
            "alarms" : [],
            "sounds" : [],
        }

        self.__file_safe_check()
        self.__load_db()

    def fetch_db(self):
        return self.__db

    def __dump_db(self):
        with open(self.__path, "w+") as outfile:
            outfile.write(json.dumps({}))

    def __file_safe_check(self):
        if os.path.exists(self.__path) is False:
            self.__dump_db()

    def __update_db(self, nDb: {}):
        self.__db=nDb
        self.__dump_db()

    def __load_db(self):
        self.__db = json.load(
            open(self.__path)
        )

db = AlarmSoundDB()

@app.route('/ping', methods=['GET'])
def test():
    return jsonify(
        {
            "result" : "api up!"
        }
    )

@app.route('/alarm', methods=['GET'])
def getAlarms():
    return jsonify(
        db.fetch_db()["alarms"]
    )

@app.route('/sound', methods=['GET'])
def getSounds():
    return jsonify(
        db.fetch_db()["sounds"]
    )


@app.route('/alarm', methods=['POST'])
def addAlarm():
    return jsonify(
        {
            "result" : "api up!"
        }
    )

@app.route('/sound', methods=['POST'])
def addAlarmSound():
    return jsonify(
        {
            "result" : "api up!"
        }
    )

@app.route('/alarm', methods=['PATCH'])
def updateAlarm():
    return jsonify(
        {
            "result" : "api up!"
        }
    )

@app.route('/sound', methods=['POST'])
def updateSound():
    return jsonify(
        {
            "result" : "api up!"
        }
    )


if __name__ == '__main__':
    app.run()
    exit(0)