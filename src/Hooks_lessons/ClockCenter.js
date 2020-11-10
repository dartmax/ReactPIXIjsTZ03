import React, {useState, useEffect} from "react";
// import ClockRight from './ClockRight';
import TimeArrow from './TimeArrow'
import {calculateClockAngle} from './calculateClockAngle'

function ClockCenter() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setTimeout(() => {setSeconds(seconds + 1)}, 1000)
  }, [seconds])

  const secondAngle = calculateClockAngle(seconds, 'seconds')


  return(
    <div>
      <div className="clock-wrapper">
        <div className="clock-center">
          <TimeArrow angle={secondAngle} type='seconds' />
          <TimeArrow type='minutes' />
          <TimeArrow type='hours' />
        </div>
      </div>
    </div>
  );
}

export default ClockCenter;