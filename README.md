# Bluetooth Treadmill Bridge to  Google Fit 

A web app to collect step counts from the Egofit Walker Pro treadmill via bluetooth and add them to a Google Fit account. I built this for my own personal use because I like to track my steps using Google Fit but the treadmill I have has its own app that doesn't integrate with Google Fit.

Currently deployed at: https://treadmill-to-google-fit.netlify.app/ -- 
**Google app verification is not complete so a warning message will appear when authenticating.** (Google enforces verification for apps that access sensitive or restricted data, ie. fitness data)


## Features
 - Displays live treadmill workout stats (steps, elapsed time, distance, speed, calories)
 - Shows summary of completed workouts
 - Uploads step counts from completed workouts to Google Fit


## Technologies Used
- [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [Google Fit REST API](https://developers.google.com/fit/rest)
- [Google OAuth 2.0 - implicit grant model](https://developers.google.com/identity/oauth2/web/guides/use-token-model)

## How It Works
### Hacking the Bluetooth
To figure out how to get the data from the treadmill, I used the process described here by Yves Debeer: [Hacking the bluetooth of my treadmill](https://yvesdebeer.github.io/Treadmill-Bluetooth/). Big thanks to Yves for documenting his process! Following this as a guide, I found the custom service and characteristic IDs used by the treadmill to request and send data. The custom service has 2 characteristics: one to send a request for data to the treadmill (properties: WRITE, WRITE NO RESPONSE) and one to receive the incoming data (properties: NOTIFY). Once the data was coming in, I reverse engineered the responses from the treadmill to determine the meaning of each byte (step count, speed, distance, etc.)

### Developing the App
The app is built using React and is an entirely client-side. It uses the Web Bluetooth API to connect to the treadmill and request data on a 3s interval to display. When a treadmill session is completed (ie. treadmill is stopped, not paused), it displays the workout summary and allows you to upload the step count to Google Fit if you are logged in with your google account.

The code for bluetooth functionality, treadmill data parsing and the Google Fit integration can be found the [Utility](https://github.com/karivanvliet/treadmill-bridge/tree/main/src/Utility) folder.

## Compatible Devices & Browsers
The app has only been tested on my personal treadmill from Egofit. It may work for other models from this brand as well, but this depends if their custom bluetooth service and characteristic UUIDs are the same across models.
- Egofit Walker Pro treadmill

The Web Bluetooth API is only compatible with the following browsers
- Chrome
- Chrome Android
- Edge 
- Opera
- Opera Android
- Samsung Internet
