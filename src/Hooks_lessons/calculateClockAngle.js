export function calculateClockAngle(value, type){
  console.log("calculateClockAngle", value, type);
  let angle = 0;
  switch (type){
    case "minutes":{
      angle = 360 * (value / 60);
      break;
    }
    case "seconds": {
        angle = 360 * (value / 60);
        break;
      }
    case "hours": {
      angle = 360 * (value / 60);
    }
  }
  return angle;
}