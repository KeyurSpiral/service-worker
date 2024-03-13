// index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    console.log('New content is available; please refresh.');
  },
  onSuccess: (registration) => {
    console.log('Service Worker registration successful!');
    // Trigger background sync here if needed
  },
  onError: (error) => {
    console.error('Service Worker registration failed: ', error);
  },
});

reportWebVitals();
