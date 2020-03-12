import React from 'react';
import { render } from '@testing-library/react';
import {Clock} from './components/clock/Clock';
import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:5000/");
socket.on('connect', function(data) {
  console.log("connected to socket")
});
console.log(socket);
function App() {
  return (
    <Clock date={new Date()} />
   
  );
}

export default App;
