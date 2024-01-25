import React from 'react';
import { bluetoothDisconnect } from '../Utility/bluetooth';
import treadmill from '../treadmill128.png';

function Disconnect(props) {
  const { server, handleServiceChange, handleServerChange } = props;
  async function disconnect() {
    await bluetoothDisconnect(server);
    handleServiceChange('');
    handleServerChange('');
  }
  return (
    <button type="button" id="disconnect-button" className="button" onClick={disconnect}>
      <div id="connectText" className="buttonDiv">
        <img src={treadmill} alt="Treadmill Logo" />
        Disconnect
      </div>
    </button>
  );
}

export default Disconnect;
