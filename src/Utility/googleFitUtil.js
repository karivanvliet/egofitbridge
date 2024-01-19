const dataSourceId = 'raw:com.google.step_count.delta:578097828784:EgoFit:Walker Pro:123456'

export async function getData(accessToken) {
    const response = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${accessToken}`
        },
        body: JSON.stringify({
            "aggregateBy": [{
                "dataSourceId":
                  "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
              }],
            "bucketByTime": {
              "durationMillis": 86400000
            },
            "endTimeMillis": 1705610765363,
            "startTimeMillis": 1705610765363 - (7*86400000)
          })
    })
    const data = await response.json()
    console.log(data.bucket)
    return data;
}


export async function retrieveDataSource(accessToken){
    let dataSource;
    const response = await fetch(`https://www.googleapis.com/fitness/v1/users/me/dataSources/${dataSourceId}`, {
        method:  "GET", 
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${accessToken}`
        }
    })

    try {
        dataSource = await response.json()
        if (dataSource.error){
            if(dataSource.error.status === "NOT_FOUND"){
                throw new Error('DataResource does not exist')
            }
        }
    } catch (e) {
        let createResponse = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataSources", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${accessToken}`
            },
            body: JSON.stringify({
                "name": "egofit-bridge-steps",
                "dataType": {
                    "field": [{
                        "name": "steps",
                        "format": "integer"
                    }],
                    "name": "com.google.step_count.delta"
                },
                "application": {
                    "name": "EgoFit Bridge",
                    "version": "1.0"
                },
                "device": {
                    "model": "Walker Pro",
                    "version": "1",
                    "type": "unknown",
                    "uid": "123456",
                    "manufacturer":"EgoFit"
                },
                "type": "raw"
                    
            })
        })

        dataSource = await createResponse.json()
    }
    
    console.log(dataSource)
}

export async function insertSteps(treadmillData, accessToken) {
    console.log(treadmillData)
    const dataTypeName = "com.google.step_count.delta";
    const endTimeNs = Date.now()*1000000 // current time in nanoseconds;
    const startTimeNs = endTimeNs - (treadmillData.sessionTimeSec*1000000000);
    const value = treadmillData.steps;

    const body = {
        dataSourceId: dataSourceId,
        maxEndTimeNs: endTimeNs,
        minStartTimeNs: startTimeNs,
        point: {
            dataTypeName: dataTypeName,
            endTimeNanos: endTimeNs,
            originDataSourceId: "",
            startTimeNanos: startTimeNs,
            value: [
                {
                    intVal: value
                }
            ]
        }
    }
    console.log(body)

    const addResponse = await fetch(`https://www.googleapis.com/fitness/v1/users/me/dataSources/${dataSourceId}/datasets/${startTimeNs}-${endTimeNs}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
    })

    const addComplete = await addResponse.json();
    console.log(addComplete)

}