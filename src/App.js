import React, { Component }  from 'react';
import {Clock} from './components/clock/Clock';
import {AlarmPicker} from './components/alarmPicker/AlarmPicker';

function App() {
  return (
    <React.Fragment>
    <Clock />
    <AlarmPicker />
    </React.Fragment>
  );
}

export default App;
