import React, { useState, useEffect, useRef } from 'react';

import './App.css';
import Connect from './components/Connect';
import Disconnect from './components/Disconnect';
import SessionData from './components/SessionData';
import SessionSummary from './components/SessionSummary';
// import UploadData from './components/UploadData';
import parseData from './Utility/parseData';
import bigQueryUpload from './Utility/bigQueryUpload';
import { insertSteps } from './Utility/googleFitUtil';
import g from './g.png';

const CLIENT_ID = '578097828784-l0ieit344qhi27fas9q2gp6i3fn3smjd.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.activity.write https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/bigquery';

function App() {
  const initialData = {
    speed: 0,
    distance: 0,
    calories: 0,
    sessionTimeSec: 0,
    timeDelta: 0,
    steps: 0,
    stepDelta: 0,
    endTime: Date.now(),
  };
  let sessionId = crypto.randomUUID();
  let rows = [{ json: { ...initialData, collectedDateTime: new Date().toISOString(), sessionId } }];

  const [server, setServer] = useState();
  const [service, setService] = useState();
  const [treadmillData, setTreadmillData] = useState(initialData);
  const [user, setUser] = useState({});
  const [tokenClient, setTokenClient] = useState({});
  const [accessToken, setAccessToken] = useState('');
  const [lastSession, setLastSession] = useState(initialData);

  const dataStateRef = useRef();
  dataStateRef.current = treadmillData;

  const tokenStateRef = useRef();
  tokenStateRef.current = accessToken;

  const handleSignOut = async () => {
    setUser({});
    await google.accounts.oauth2.revoke(tokenStateRef.current);
    setAccessToken('');
  };

  // const checkToken = async (accToken) => {
  //   const tokenData = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${accToken}`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${accToken}`,
  //     },
  //   });

  //   const tokenDataJson = await tokenData.json();
  //   if (tokenDataJson.error) {
  //     throw new Error(tokenDataJson.error);
  //   }
  // };

  const requestToken = () => {
    tokenClient.requestAccessToken();
  };

  useEffect(() => {
    /* global google */

    setTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (tokenResponse) => {
          setAccessToken(tokenResponse.access_token);
          const currentUser = await fetch('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          });

          const userData = await currentUser.json();
          const loggedInUser = {
            name: userData.names[0].displayName,
            email: userData.emailAddresses[0].value,
            photo: userData.photos[0].url,
          };
          setUser(loggedInUser);
        },
      }),
    );

    // google.accounts.id.initialize({
    //   client_id:CLIENT_ID,
    //   callback: handleLoginResponse
    // })

    // google.accounts.id.renderButton(
    //   document.getElementById("signInDiv"),
    //   {theme: "outline", size:"large"}
    // );
  }, []);

  const handleServerChange = (newServer) => {
    setServer(newServer);
  };

  const handleServiceChange = (newService) => {
    setService(newService);
  };

  const handleDataChange = (e) => {
    if (e.target.value.byteLength === 17) {
      const parsedData = parseData(e.target.value);
      setTreadmillData((prevData) => {
        if (parsedData.steps === 0 && parsedData.sessionTimeSec > 0 && prevData.steps) {
          return ({
            ...parsedData,
            steps: prevData.steps,
            stepDelta: 0,
            timeDelta: parsedData.sessionTimeSec - prevData.sessionTimeSec,
            endTime: Date.now(),
          });
        }

        return ({
          ...parsedData,
          steps: parsedData.steps,
          stepDelta: parsedData.steps - prevData.steps,
          timeDelta: parsedData.sessionTimeSec - prevData.sessionTimeSec,
          endTime: Date.now(),
        });
      });

      rows.push({
        json: {
          ...dataStateRef.current,
          collectedDateTime: new Date().toISOString(),
          sessionId,
        },
      });
    } else {
      sessionId = crypto.randomUUID();
      if (dataStateRef.current.steps > 0) {
        setLastSession({ ...dataStateRef.current, endTime: Date.now(), uploaded: false });
      }
      setTreadmillData(initialData);
    }

    if (rows.length && tokenStateRef.current) {
      bigQueryUpload(rows, tokenStateRef.current);
      rows = [];
      insertSteps(dataStateRef.current, tokenStateRef.current);
    }
  };

  // const toggleDataUpload = (uploadedSession) => {
  //   setLastSession(uploadedSession);
  // };

  return (
    <div className="App">
      <header>
        <span>
          <h1>Treadmill → Google Fit</h1>
          <h2>for the EgoFit Walker Pro</h2>
        </span>
        <button type="submit" onClick={requestToken} title="Sign in with Google" className={user.name ? 'hidden' : 'signInButton'}>
          <img src={g} alt="Google logo" />
          {' '}
          <span>Sign in with Google</span>
        </button>
        {user.name
          && (
          <div id="profile" className="profile">
            <div className="userInfo">
              <img src={user.photo} alt="Profile" referrerPolicy="no-referrer" />
              <p>{user.name}</p>
            </div>
            <button type="button" className="signOut" onClick={() => handleSignOut()}>Log out</button>
          </div>
          )}
      </header>

      <main className="mainDisplay">
        <section id="current-section" className="displaySection">
          {service ? <SessionData service={service} treadmillData={treadmillData} /> : <div />}
          {server ? (
            <Disconnect
              handleServerChange={handleServerChange}
              handleServiceChange={handleServiceChange}
              server={server}
            />
          ) : (tokenStateRef.current
            && <Connect
              handleServerChange={handleServerChange}
              handleServiceChange={handleServiceChange}
              handleDataChange={handleDataChange}
            />
          )}
        </section>
        <section id="summary-section" className="displaySection">
          <SessionSummary lastSession={lastSession} />
          {/* <UploadData
            treadmillData={lastSession}
            accessToken={accessToken}
            toggleDataUpload={toggleDataUpload}
            checkToken={checkToken}
            handleSignOut={handleSignOut}
          /> */}
        </section>
      </main>
      <footer>
        {/* <span>Find me on LinkedIn or GitHub</span> */}
        <a href="https://www.linkedin.com/in/kari-van-vliet/" target="_blank" rel="noreferrer"><i className="fa fa-brands fa-linkedin" aria-label="linkedin link" /></a>
        <a href="https://github.com/karivanvliet/treadmill-bridge" target="_blank" rel="noreferrer"><i href="#" className="fa fa-brands fa-github" aria-label="github link" /></a>
        <div><a href="https://www.flaticon.com/free-icons/treadmill" title="treadmill icons">Treadmill icons created by surang - Flaticon</a></div>
      </footer>

    </div>
  );
}

export default App;
