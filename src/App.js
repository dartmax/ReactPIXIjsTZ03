import React from 'react';
import './App.css';
import {CreateGame} from './components/GameContainer'
import ClockCenter from './Hooks_lessons/ClockCenter'
const App = () => (
  CreateGame(<div id="main">
    <div id="heder-container">
      <div id="block-button">
        <input id="shapesCount" disabled/>
        <input id="gravityCount" disabled/>
      </div>
    </div>
    <div id="app" />
    <div id="footer-container">
      <div id="block-button">
        <button id="removeShape" onClick="click()">-</button>
        <button id="addShappe">+</button>
      </div>
      <p id="button-text">Add Shapes</p>
      <div id="block-button">
        <button id="removeGravity" onClick="click()">-</button>
        <button id="addGravity" onClick="click()">+</button>
      </div>
      <p id="button-text">Add Gravity</p>
    </div>
    <div>{ClockCenter}</div>
  </div>)
)

export default App;
