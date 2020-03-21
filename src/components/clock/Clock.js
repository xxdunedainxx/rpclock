import React from 'react';
import './Clock.css';

class ClockHand extends React.Component{

}

export class Clock extends React.Component {

    static defaultInterval = 1000;
    firstLoad = true;
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
  
   calculateHands() {
    var second = this.state.date.getSeconds();
    var secondDeg = ((second / 60) * 360); 
    document.getElementsByClassName("secondHand")[0].style.transform = `rotate(${secondDeg}deg)`;
    
    var minute = this.state.date.getMinutes();
    var minuteDeg = ((minute / 60) * 360); 
    document.getElementsByClassName("minuteHand")[0].style.transform = `rotate(${minuteDeg}deg)`;

    var hour = this.state.date.getHours();
    var hourDeg = ((hour / 12 ) * 360 ); 
    document.getElementsByClassName("hourHand")[0].style.transform = `rotate(${hourDeg}deg)`;
   }

   clockInterval() {
    var interval = setInterval(() => {
      this.state.date.setMilliseconds(this.state.date.getMilliseconds() + this.interval)
      this.setState(
        {date: (this.state.date )}
      );
      this.calculateHands()
      if(this.firstLoad) {
        document.getElementById("loading").style.visibility = "hidden";
        document.getElementById("clockSection").style.visibility = "visible";
        this.firstLoad = false;
      }
    }, this.interval);
   }
  
    render(){
    return (
        <div>
            <div id="loading">Loading please wait..</div>
            <div id="clockSection">
            <div class="time">{this.state.date.toLocaleTimeString()}</div>
            <div class="clock">
                <div class="hourHand"></div>
                <div class="minuteHand"></div>
                <div class="secondHand"></div>
                <div class="center"></div>
            
                <ul>
                    <li><span>1</span></li>
                    <li><span>2</span></li>
                    <li><span>3</span></li>
                    <li><span>4</span></li>
                    <li><span>5</span></li>
                    <li><span>6</span></li>
                    <li><span>7</span></li>
                    <li><span>8</span></li>
                    <li><span>9</span></li>
                    <li><span>10</span></li>
                    <li><span>11</span></li>
                    <li><span>12</span></li>
                </ul>
            </div>
            </div>
      </div>
    );
    }
  
  
  
  

}

export default Clock;