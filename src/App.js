import React from 'react';
import { render } from '@testing-library/react';

/*
document.addEventListener('DOMContentLoaded', () =>
  requestAnimationFrame(updateTime)
)

function updateTime() {
  document.documentElement.style.setProperty('--timer-day', "'" + moment().format("dd") + "'");
  document.documentElement.style.setProperty('--timer-hours', "'" + moment().format("k") + "'");
  document.documentElement.style.setProperty('--timer-minutes', "'" + moment().format("mm") + "'");
  document.documentElement.style.setProperty('--timer-seconds', "'" + moment().format("ss") + "'");
  requestAnimationFrame(updateTime);
}*/

class Clock extends React.Component {

  static defaultInterval = 1000;

 constructor(props) {
   super(props)
  if(this.props.interval) {
    this.interval = this.props.interval;
  } else {
    this.interval = Clock.defaultInterval;
  }
  this.state = {
    date: new Date()
  }
  this.clockInterval();
 }

 clockInterval() {
  setInterval(() => {
    console.log('Interval triggered');
    this.state.date.setMilliseconds(this.state.date.getMilliseconds() + this.interval)
    this.setState(
      {date: (this.state.date )}
    );
  }, this.interval);
 }

  render(){
  return (
    <div>
      <h3>Zach's stupid clock</h3>
      <h2>{this.state.date.toLocaleTimeString()}.</h2>
      <div class="clock-container">
  <div class="clock-col">
    <p class="clock-day clock-timer">
    </p>
    <p class="clock-label">
      Day
    </p>
  </div>
  <div class="clock-col">
    <p class="clock-hours clock-timer">
    </p>
    <p class="clock-label">
      Hours
    </p>
  </div>
  <div class="clock-col">
    <p class="clock-minutes clock-timer">
    </p>
    <p class="clock-label">
      Minutes
    </p>
  </div>
  <div class="clock-col">
    <p class="clock-seconds clock-timer">
    </p>
    <p class="clock-label">
      Seconds
    </p>
  </div>
</div>
    </div>
  );
  }




}

function App() {
  return (
    <Clock date={new Date()} />
   
  );
}

export default App;
