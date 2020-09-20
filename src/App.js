import React from 'react';
import './App.css';
import Rectangle from './components/Reactangle'
import { Stage } from '@inlet/react-pixi'

const App = () => (
  <div className="main">
    <div className="footer-container">
      <div className="block-button">
        <input placeholder="number of current shapes" inactive/>
        <input placeholder="area occupied by shapes" />
      </div>
    </div>
    <Stage className="StageStyle" width={800} height={600} options={{antialias: true}}>
      <Rectangle />
    </Stage>
    <div className="footer-container">
      <div className="block-button">
        <button className="number-button" type="button">-</button>
        <button className="number-button" type="button">+</button>
      </div>
      <p className="button-text">Add shapes</p>
      <div className="block-button">
        <button className="number-button" type="button">-</button>
        <button className="number-button" type="button">+</button>
      </div>
      <p className="button-text">Increase Gravity</p>
    </div>
  </div>
)

export default App;
