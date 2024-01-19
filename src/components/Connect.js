import {bluetoothConnect} from '../Utility/bluetooth.js'

export function Connect(props) {

    async function connect () {
        const [newServer, pService, notifyChar] = await bluetoothConnect()

        //Save connected server
        props.handleServerChange(newServer)
        
        //Save connected service state
        props.handleServiceChange(pService);

        //Add event listener for incoming bluetooth data characteristic
        notifyChar.addEventListener('characteristicvaluechanged',
        props.handleDataChange);
    }

    return (
        <>
            <div>Not paired to Treadmill. Click connect to start.</div>
            <button id="connect-button" className= "button connect-button" onClick={connect}>Connect</button>
        </>
    )

}
