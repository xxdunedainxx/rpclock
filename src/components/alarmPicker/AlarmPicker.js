import React, { Component }  from 'react';
import Collapsible from 'react-collapsible';
import {Button, FormControl} from 'react-bootstrap';
import './AlarmPicker.css';

function toggleAlarmVisibility(visible) {
  if(visible) {
    document.getElementById("alarmTrigger").style.visibility = "visible"
    document.getElementById("alarmTrigger").style.display = "inline"
  } else {
      document.getElementById("alarmTrigger").style.visibility = "hidden"
      document.getElementById("alarmTrigger").style.display = "none"
  }
}

class AddSoundColapsible extends Collapsible {
  constructor(props) {
    super(props);
  }

  triggerWhenOpen () {
    this.trigger = "- Close"
  }

  onClosing() {
    this.trigger = "+ New sound"
  }
}

class AddAlarmCollapsible extends Collapsible {
  constructor(props) {
    super(props);
  }

  triggerWhenOpen () {
    this.trigger = "- Close"
  }

  onClosing() {
    this.trigger = "+ Alarm"
  }
}

class AlarmSound  {
  constructor(soundName, fileValue) {
    this.name = soundName
    this.file = fileValue
  }
}

class AlarmSoundComponent extends React.Component  {
  constructor(alarmSound) {
    this.alarmSound = alarmSound
  }

  render() {
    return this.alarmSound.name
  }
}

// alarm sound db / cache
class AlarmSounds {
  static alarms = {};
}

class AlarmConfig extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    // type int
    this.time = this.checkTime(props.time)
    // type string
    this.description = props.description
    // type AlarmSound 
    this.alarmSound = new AlarmSound(props.sound.soundName, props.sound.fileValue)
    // if alarm is on
    this.enabled = true;
    // uid 
    this.uid = props.id;
    this.clockInterval = null;
    this.alarmInterval()
    this.parent = props.parent;
    this.currentAlarm = null;
    console.log(this)
  }

  checkTime(time) {
    if(time < 0 || time > 24) {
       time = 12
    }
    return time
  }

  toggleEnable() {
    this.enabled = !this.enabled;
  }

  calculateInterval() {
    var midnightMili = 24 * 3600000;
    var now = new Date();
    var nowMili = (now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000)
    var hoursBuffer = 0;
    var timeMiliSeconds =this.time * 3600000;
    if(nowMili < timeMiliSeconds) {
      hoursBuffer = timeMiliSeconds - nowMili;
    } else {
      hoursBuffer = (midnightMili - nowMili) + timeMiliSeconds;
    }
    
    console.log(hoursBuffer);
    return hoursBuffer;
  }

  sound() {

  }

  stop() {
    this.audioElement.pause()
    this.audioElement.currentTime = 0
  }
 
  clearAlarm(audioElement) {
    new Promise(resolve => setTimeout(resolve, this.audioElement.duration * 1000)).then(() => {
      console.log("pausing audio")
      console.log(audioElement)
      this.stop();
      toggleAlarmVisibility(false)
    })
  }

  componentDidMount() {
    console.log("grabbing audio element")
    this.audioElement = document.getElementById(this.uid)
    console.log(this.audioElement)
  }
  contentChange(e) {
    console.log(e.target)
  }

  emitConfigUpdate() {
    console.log("updating blah")
  }

  render() {
    return(
    <tr>
      <td contenteditable="true" onInput={this.contentChange}>{this.description}</td>
      <td contenteditable="true" onInput={this.contentChange}>{this.time}</td>
      <td contenteditable="true" onInput={this.contentChange}>{this.alarmSound.name}<audio controls src={this.alarmSound.file} id={this.uid} ></audio></td>
    </tr>
    );
  }
  triggerAlarm() { 
    // if enabled, WAKE UP 
    if(this.enabled) {
      this.audioElement.play()
      this.parent.alarmEvent(this)
      this.clearAlarm()
      // clear existing interval
      clearInterval(this.clockInterval);
      
      // start up a new interval
      this.alarmInterval();
    }
  }

  alarmInterval() {
    this.clockInterval = setInterval(() => {
      this.triggerAlarm();
    }, this.calculateInterval());
   }
}

export class AlarmPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alarms: [],
      sounds: [],
    }

    this.alarms = [];
    this.sounds = [];

    this.fetchBoth();
  }

  fetchAlarmConfigs() {
    return fetch("http://127.0.0.1:5000/alarm",                {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })
    .then(res => res.json())
    .then(
      (result) => {
        console.log("api respond")
        console.log(result)
        this.alarms = result
        for(var i = 0; i < this.alarms.length; i++) {
          this.alarms[i]["sound"] = this.state.sounds[this.alarms[i]["soundItemIndex"]]
        }
        this.setState(
          {
            alarms: this.alarms
          }
        )
      },
      (error) => {
        console.log("error?")
        console.log(error)
      }
    )
  }

  fetchAlarmSounds() {
    return fetch("http://127.0.0.1:5000/sound",                {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })
    .then(res => res.json())
    .then(
      (result) => {
        this.sounds = result
        this.setState(
          {
            sounds: this.sounds
          }
        )
      },
      (error) => {
        console.log("error?")
        console.log(error)
      }
    )
  }

  fetchBoth() {
    this.fetchAlarmSounds()
    .then(
      this.fetchAlarmConfigs()
    )
  }

  renderSoundOptionList() {
    return (
      this.state.sounds.map(
        sound => (
          <option value={sound.id}>{sound.soundName}</option>
        )
      )
    );
  }

  renderAlarmsTable() { 
    return (
      <table class="container">
        <thead>
          <tr>
            <th><h1>Description</h1></th>
            <th><h1>Time</h1></th>
            <th><h1>sound</h1></th>
          </tr>
        </thead>
        <tbody>
          {this.state.alarms.map(
            alarm => (
              <AlarmConfig description={alarm.description} time={alarm.time} sound={alarm.sound} id={alarm.id} parent={this}/>
            )
          )}
        </tbody>
      </table>
    );
  }

  alarmEvent(object) {
    console.log("alarm event ")
    console.log(object)
    toggleAlarmVisibility(true)
    this.currentAlarm = object
    console.log(this.currentAlarm)
  }

  stopAlarm() {
    console.log(this)
    if(this.currentAlarm) {
      this.currentAlarm.stop();
      toggleAlarmVisibility(false)
    } else {
      console.log("no alarm to stop")
    }
  }

  render(){ 
    return (
      <div>
      <div class="main-block">
      <h3>Manage Alarms</h3>
      <button id="alarmTrigger" onClick={this.stopAlarm.bind(this)}>Stop alarm!</button>
      <AddAlarmCollapsible trigger="+ Alarm" classParentString="addAlarm" triggerWhenOpen="- Close" >
        <div class="info">
          <input class="fname" type="text" name="name" placeholder="Alarm Description" />
          <label for="alarmTime">Choose a new alarm time</label>
          <input type="time" id="alarmTime" name="alarmTime" required />
          <select>
            <option value="time" disabled selected>Pick an alarm sound</option>
            {this.renderSoundOptionList()}
          </select>
        </div>
        <button href="/" class="button">Submit</button>
      </AddAlarmCollapsible>
      <br />
      <AddSoundColapsible trigger="+ New sound" classParentString="addAlarm" triggerWhenOpen="- Close">
        <div class="info">
          <input class="sname" type="text" name="name" placeholder="Sound name" />
          <input type="file" name="fileToUpload" id="fileToUpload"></input>
        </div>
        <button href="/" class="button">Submit</button>
      </AddSoundColapsible>
      {this.renderAlarmsTable()}
      </div>
      </div>
    );
  }
}

export default AlarmPicker;