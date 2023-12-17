
import './App.css';
import { Connect, Request } from './components/Bluetooth.js'
import Auth from './components/Auth.js'
import { useState } from 'react';

function App() {
  const [service, setService] = useState()

  const handleServiceChange = (newService) => {
    setService(newService)
  }

  return (
    <div className="App">
      <Auth />
      <Connect handleServiceChange={handleServiceChange} />
      {service ? <Request service={service} /> : <></>}
    </div>
  );
}

export default App;
