import React from 'react';

function SessionSummary(props) {
  const { lastSession } = props;
  let timeMin = Math.floor(lastSession.sessionTimeSec / 60);
  timeMin = timeMin < 10 ? timeMin = `0${timeMin}` : timeMin;
  let timeSec = lastSession.sessionTimeSec - timeMin * 60;
  timeSec = timeSec < 10 ? timeSec = `0${timeSec}` : timeSec;
  return (
    <fieldset id="display-data" className="sessionForm">
      <legend>Previous Session Summary</legend>
      <div className={lastSession.steps > 0 ? 'sessionForm' : 'hidden'}>
        <label htmlFor="stepsSum" className="displayFieldSummary">
          <span>Total Steps:</span>
          <input id="stepsSum" value={lastSession.steps} disabled />
        </label>
        <label htmlFor="secondsSum" className="displayFieldSummary">
          <span>Session Time (MM:SS):</span>
          <input id="secondsSum" value={`${timeMin}:${timeSec}`} readOnly />
        </label>

        <label htmlFor="distanceSum" className="displayFieldSummary">
          <span>Distance Travelled (km):</span>
          <input id="distanceSum" value={lastSession.distance} readOnly />
        </label>

        <label htmlFor="caloriesSum" className="displayFieldSummary">
          <span>Calories Burned:</span>
          <input id="caloriesSum" value={lastSession.calories} readOnly />
        </label>
      </div>
      <div className={lastSession.steps > 0 ? 'hidden' : 'sessionForm'}>
        <p>No sessions have been completed.</p>
      </div>
    </fieldset>
  );
}

export default SessionSummary;
