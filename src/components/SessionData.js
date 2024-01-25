import React, { useEffect } from 'react';
import { bluetoothRequest } from '../Utility/bluetooth';

function SessionData(props) {
  const { service, treadmillData } = props;
  useEffect(() => {
    const intId = setInterval(() => {
      bluetoothRequest(service);
    }, 3000);
    return () => {
      clearInterval(intId);
    };
  }, [service]);

  let timeMin = Math.floor(treadmillData.sessionTimeSec / 60);
  timeMin = timeMin < 10 ? timeMin = `0${timeMin}` : timeMin;
  let timeSec = treadmillData.sessionTimeSec - timeMin * 60;
  timeSec = timeSec < 10 ? timeSec = `0${timeSec}` : timeSec;

  return (
    <fieldset id="display-data" className="sessionForm">
      <legend>Current Session</legend>
      <label htmlFor="steps" className="displayField displayFieldSteps">
        Step Count
        <input id="steps" value={treadmillData.steps} readOnly />
      </label>
      <label htmlFor="seconds" className="displayField">
        Elapsed Time (MM:SS)
        <input id="seconds" value={`${timeMin} : ${timeSec}`} readOnly />
      </label>

      <label htmlFor="speed" className="displayField">
        Current Speed (km/h)
        <input id="speed" value={treadmillData.speed} readOnly />
      </label>

      <label htmlFor="distance" className="displayField">
        Distance (km)
        <input id="distance" value={treadmillData.distance} readOnly />
      </label>

      <label htmlFor="calories" className="displayField">
        Calories
        <input id="calories" value={treadmillData.calories} readOnly />
      </label>
    </fieldset>
  );
}

export default SessionData;
