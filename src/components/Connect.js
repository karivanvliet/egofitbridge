import {bluetoothConnect} from '../Utility/bluetooth.js'

export function Connect(props) {

    async function connect () {
        document.getElementById('connectText').className='hidden'
        document.getElementById('loadingWheel').className='loader'
        const [newServer, pService, notifyChar] = await bluetoothConnect()
        document.getElementById('connectText').className=''
        document.getElementById('loadingWheel').className='hidden'

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
            <button id="connect-button" className= "button" onClick={connect}><span id='loadingWheel' className="hidden"></span><span id='connectText'>Connect</span></button>
        </>
    )

}
