
import './App.css';
import { Connect } from './components/Connect.js'
import { Disconnect } from './components/Disconnect.js'
import { SessionData } from './components/SessionData.js'
import { SessionSummary } from './components/SessionSummary.js'
import { UploadData } from './components/UploadData.js'
import { parseData } from './Utility/parseData.js'
import g from './g.png'

import { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

const CLIENT_ID = "578097828784-l0ieit344qhi27fas9q2gp6i3fn3smjd.apps.googleusercontent.com"
const SCOPES = "https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.activity.write"

function App() {
  const initialData = {
    speed:'',
    distance:'',
    calories:'',
    sessionTimeSec:'',
    steps:''
  }

  const [server, setServer] = useState();
  const [service, setService] = useState();
  const [treadmillData, setTreadmillData] = useState(initialData);
  const [sessionState, setSessionState]= useState('none');
  const [user, setUser] = useState({});
  const [tokenClient, setTokenClient] = useState({});
  const [accessToken, setAccessToken] = useState('')
  const [lastSession, setLastSession] = useState(initialData)

  const dataStateRef = useRef();
  dataStateRef.current = treadmillData;

  const handleLoginResponse = (response) => {
    console.log(response)
    const userObject = jwtDecode(response.credential);
    setUser(userObject)
    console.log(userObject)
    document.getElementById("signInDiv").className = 'hidden';
  }

  const handleSignOut = (event) => {
    setUser({})
    document.getElementById("signInDiv").className = 'signInDiv';
  }
  
  const requestToken = () =>{
    tokenClient.requestAccessToken();
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:CLIENT_ID,
      callback: handleLoginResponse
    })

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme: "outline", size:"large"}
    );

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

  }, [])

  const handleServerChange = (newServer) => {
    setServer(newServer)
  }

  const handleServiceChange = (newService) => {
    setService(newService)
  }

  const handleDataChange = (e) => {
    console.log(e.target.value)
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
      if(dataStateRef.current.steps>0){
        setLastSession({...dataStateRef.current, endTime:Date.now()})
      }
      setTreadmillData(initialData)
    }
  }
 
  return (
    <div className="App">
      <header>
        <span>
          <h1>Treadmill → GoogleFit Bridge</h1>  
          <h2>for the EgoFit Walker Pro</h2>
        </span>
        <div id="signInDiv" className="signInDiv"></div>
        {user.name && 
          <div id="profile" className="profile">
            <div className="userInfo">
              <img src={user.picture} alt="Profile"  referrerPolicy="no-referrer"></img>
              <p>{user.name}</p>
            </div> 
            <button className="signOut" onClick={(e)=> handleSignOut(e)}>Log out</button>
          </div>
        }
      </header>
      
      <main className="mainDisplay">
        <section id="current-section">
          {service ? <SessionData service={service} treadmillData={treadmillData}/> : <></>}
          {server ? <Disconnect handleServerChange={handleServerChange} handleServiceChange={handleServiceChange} server={server}/> : <Connect handleServerChange={handleServerChange} handleServiceChange={handleServiceChange} handleDataChange={handleDataChange}/>}
        </section>
        <section id="summary-section">
          {lastSession.steps > 0? 
            <>
              <SessionSummary lastSession={lastSession}/> 
              {accessToken ? <UploadData treadmillData={lastSession} accessToken={accessToken}/> : <>
                <button type="submit" onClick={requestToken} className= "button">
                  <img src={g} alt="Google logo"></img> <span>Authorize google permissions</span>
                  </button>
                </>}
            </>: <></>}
        </section>
      </main>
      
    </div>
  );
}

export default App;
