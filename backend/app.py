from flask import Flask, render_template
from flask_socketio import SocketIO, emit, send
from flask_cors import CORS
from threading import Lock
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
cors = CORS(app, resources={r"*": {"origins": "http://localhost:3000/"}})
thread = None
thread_lock = Lock()
def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        socketio.sleep(10)
        count += 1
        socketio.emit('my_response',
                      {'data': 'Server generated event', 'count': count},
                      namespace='/test')


@socketio.on('connect')
def test_connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)
    emit('my_response', {'data': 'Connected', 'count': 0})

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('message')
def handle_message(message):
    send(message, namespace='/chat')

def some_function():
    socketio.emit('some event', {'data': 42})
if __name__ == '__main__':
    socketio.start_background_task(background_thread)
    socketio.run(app, debug = False)
    exit(0)