
import './App.css';
import { Connect } from './components/Connect.js'
import { Disconnect } from './components/Disconnect.js'
import { SessionData } from './components/SessionData.js'
import { UploadData } from './components/UploadData.js'
import { parseData } from './Utility/parseData.js'

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const CLIENT_ID = "578097828784-l0ieit344qhi27fas9q2gp6i3fn3smjd.apps.googleusercontent.com"
const SCOPES = "https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.activity.write"

function App() {
  const [server, setServer] = useState();
  const [service, setService] = useState();
  const [treadmillData, setTreadmillData] = useState({
    speed:'',
    distance:'',
    calories:'',
    sessionTimeSec:'',
    steps:''
  });
  const [sessionState, setSessionState]= useState('none');
  const [user, setUser] = useState();
  const [tokenClient, setTokenClient] = useState({});
  const [accessToken, setAccessToken] = useState('')

  const handleLoginResponse = (response) => {
    console.log(response)
    const userObject = jwtDecode(response.credential);
    setUser(userObject)
    console.log(userObject)
  }
  
  const requestToken = () =>{
    tokenClient.requestAccessToken();

  }

  useEffect(() => {
    /* global google */
    setTokenClient (
      google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          console.log(tokenResponse)
          setAccessToken(tokenResponse.access_token)
        }
      })
    )

    google.accounts.id.initialize({
      client_id:CLIENT_ID,
      callback: handleLoginResponse
    })

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme: "outline", size:"large"}
    );

  }, [])

  const handleServerChange = (newServer) => {
    setServer(newServer)
  }

  const handleServiceChange = (newService) => {
    setService(newService)
  }

  const handleDataChange = (e) => {
    if (e.target.value.byteLength === 17) {
      let parsedData = parseData(e.target.value)
      setTreadmillData((prevData) => {
        if(parsedData.steps === 0 && parsedData.sessionTimeSec > 0 && prevData.steps){
          return ({...parsedData, steps: prevData.steps})
        } else {
          return parsedData
        }
      })
      if (parsedData.speed === 0) {
        setSessionState('paused')
      } else {
        setSessionState('active')
      }
    } else {
      setSessionState('none')
    }
  }
 
  return (
    <div className="App">
      <header> 
        <h1>Treadmill - GoogleFit Bridge (EgoFit Walker Pro)</h1>
        <div id="signInDiv"></div>
      </header>
      
      <section id="current-section">
        {service ? <SessionData service={service} treadmillData={treadmillData}/> : <></>}
        {server ? <Disconnect handleServerChange={handleServerChange} handleServiceChange={handleServiceChange} server={server}/> : <Connect handleServerChange={handleServerChange} handleServiceChange={handleServiceChange} handleDataChange={handleDataChange}/>}
      </section>

      <section id="summary-section">
        <input type="submit" onClick={requestToken} value="Grant Google Permissions" className= "button"></input>
      </section>

      {sessionState === 'none' && treadmillData ? <UploadData treadmillData={treadmillData} accessToken={accessToken}/> : <></>}
    </div>
  );
}

export default App;
