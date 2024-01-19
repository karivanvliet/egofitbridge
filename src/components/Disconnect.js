import {bluetoothDisconnect} from '../Utility/bluetooth.js'

export function Disconnect(props) {
    async function disconnect() {
        await bluetoothDisconnect(props.server)
        props.handleServiceChange('')
        props.handleServerChange('')
    }
    return (
        <>
            <button id="disconnect-button" className= "button" onClick={disconnect}>Disconnect</button> 
        </>
    )

}