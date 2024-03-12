import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission()
        .then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission granted');
          }
        });
    }
  }, []);

  const handlePushNotification = () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready
        .then(registration => {
          registration.showNotification('New Message', {
            body: 'You have a new message!',
          });
        });
    }
  };

  return (
    <div className="App">
      {navigator.serviceWorker.controller && "new version is availabe"}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
         new testing
        </p>
        <button type='button' onClick={handlePushNotification}>Click Here</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
