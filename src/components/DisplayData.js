
function DisplayData({ treadmillData }) {
    console.log(treadmillData)
    let speed;
    let distance;
    let steps;
    let calories;
    let timeMin;
    let timeSec;
    let valueArray = [];
    for (let i = 0; i < treadmillData.byteLength; i++) {
        valueArray.push(('00' + treadmillData.getUint8(i).toString(16)).slice(-2));
    }
    console.log('> ' + valueArray.join(' '));

    if (valueArray.length === 17) {
        speed = parseInt(valueArray[3], 16)/10;
        distance = parseInt(valueArray[8]+valueArray[7], 16)/1000;
        steps = parseInt(valueArray[11], 16);
        calories = parseInt(valueArray[10]+valueArray[9], 16)/10;        
        let time = parseInt(valueArray[6]+valueArray[5], 16);
        timeMin = Math.floor(time/60)
        timeSec = Math.floor(time - (timeMin*60))
    } else {
        speed = 0;
        distance = 0;
        steps = 0;
        calories = 0;
        timeMin = 0;
        timeSec = 0;
    }

    return (
        <>
            <section id="display-data">
                <label htmlFor="minutes">Elapsed Time (min)</label>
                <input id="minutes" value={timeMin} readOnly />
                <label htmlFor="seconds">Elapsed Time (seconds)</label>
                <input id="seconds" value={timeSec} readOnly />
                <label htmlFor="speed">Speed</label>
                <input id="speed" value={speed} readOnly />
                <label htmlFor="distance">Distance</label>
                <input id="distance" value={distance} readOnly />
                <label htmlFor="steps">Step Count</label>
                <input id="steps" value={steps} readOnly />
                <label htmlFor="calories">Calories</label>
                <input id="calories" value={calories} readOnly />
            </section>
        </>
    )
}

export default DisplayData; 