export function SessionSummary(props) {
    const {lastSession} = props;
    console.log(lastSession)
    return (
        <>
            <fieldset id="display-data" className="sessionForm">
                <legend>Previous Session Summary</legend>
                <label htmlFor="steps"  className="displayFieldSummary">
                    <span>Total Steps:</span>
                    <input id="steps" value={lastSession.steps} disabled/>
                </label>
                <label htmlFor="seconds" className="displayFieldSummary">
                    <span>Session Time:</span>
                    <input id="seconds" value={lastSession.sessionTimeSec} readOnly />
                </label>
                
                <label htmlFor="distance"  className="displayFieldSummary">
                    <span>Distance Travelled (km):</span>
                    <input id="distance" value={lastSession.distance} readOnly />
                </label>
                
                <label htmlFor="calories"  className="displayFieldSummary">
                    <span>Calories Burned:</span>
                    <input id="calories" value={lastSession.calories} readOnly />
                </label>
                
            </fieldset>
        </>
    )

}
