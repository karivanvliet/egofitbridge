import React from 'react';
import { bluetoothConnect } from '../Utility/bluetooth';
import treadmill from '../treadmill128.png';

function Connect(props) {
  const { handleServerChange, handleServiceChange, handleDataChange } = props;
  async function connect() {
    document.getElementById('errorMessage').className = 'hidden';
    document.getElementById('connectText').className = 'hidden';
    document.getElementById('loadingWheel').className = 'loader';
    try {
      const [newServer, pService, notifyChar] = await bluetoothConnect();
      document.getElementById('connectText').className = 'buttonDiv';
      document.getElementById('loadingWheel').className = 'hidden';

      // Save connected server
      handleServerChange(newServer);

      // Save connected service state
      handleServiceChange(pService);

      // Add event listener for incoming bluetooth data characteristic
      notifyChar.addEventListener(
        'characteristicvaluechanged',
        handleDataChange,
      );
    } catch (error) {
      document.getElementById('errorMessage').innerHTML = `An error occurred while connecting to device, please try again. ${error}`;
      document.getElementById('errorMessage').className = 'error';
      document.getElementById('connectText').className = 'buttonDiv';
      document.getElementById('loadingWheel').className = 'hidden';
    }
  }

  return (
    <>
      <div>
        Not paired to Treadmill. Click connect to start.
        <p id="errorMessage" className="hidden" />
      </div>
      <button type="button" id="connect-button" className="button" onClick={connect} title="Connect to treadmill">
        <span id="loadingWheel" className="hidden" />
        <div id="connectText" className="buttonDiv">
          <img src={treadmill} alt="Treadmill Logo" />
          Connect
        </div>
      </button>
    </>

  );
}

export default Connect;
