
import './App.css';
import { Connect, Request } from './components/Bluetooth.js'
import Auth from './components/Auth.js'
import DisplayData from './components/DisplayData.js'
import { useState } from 'react';

function App() {
  const [service, setService] = useState();
  const [treadmillData, setTreadmillData] = useState();

  const handleServiceChange = (newService) => {
    setService(newService)
  }

  const handleDataChange = (e) => {
    setTreadmillData(e.target.value)
  }
  
  return (
    <div className="App">
      <Auth />
      <Connect handleServiceChange={handleServiceChange} handleDataChange={handleDataChange}/>
      {service ? <Request service={service} /> : <></>}
      {treadmillData ? <DisplayData treadmillData={treadmillData} /> : <></>}
    </div>
  );
}

export default App;
