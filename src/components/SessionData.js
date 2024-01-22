import { bluetoothRequest } from '../Utility/bluetooth.js'
import { useEffect } from 'react'

export function SessionData(props) {
    const {service, treadmillData} = props
    useEffect(()=>{
        let intId = setInterval( () => {
            bluetoothRequest(service)
        }, 3000);
        return () => {
            clearInterval(intId)
        }
    },[service]);

    return (
        <>
            <fieldset id="display-data" className="sessionForm">
                <legend>Current Session</legend>
                <label htmlFor="steps"  className="displayField displayFieldSteps">Step Count
                    <input id="steps" value={treadmillData.steps} readOnly />
                </label>
                <label htmlFor="seconds" className="displayField">Elapsed Time (seconds)
                    <input id="seconds" value={treadmillData.sessionTimeSec} readOnly />
                </label>
                
                <label htmlFor="speed"  className="displayField">Current Speed (km/h)
                    <input id="speed" value={treadmillData.speed} readOnly />
                </label>
                
                <label htmlFor="distance"  className="displayField">Distance (km)
                    <input id="distance" value={treadmillData.distance} readOnly />
                </label>
                
                <label htmlFor="calories"  className="displayField">Calories
                    <input id="calories" value={treadmillData.calories} readOnly />
                </label>
                
            </fieldset>
        </>
    )

}
