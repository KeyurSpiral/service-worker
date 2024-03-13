import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };
  
  const decrement = () => {
    setCount(count - 1);
  };
  
  const handleSync = () => {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready
      .then(function (registration : any) {
        return registration.sync.register("syncCount");
      })
      .catch(function (err) {
        console.error("Unable to register sync: ", err);
        });
    } else {
      console.error("Background sync not supported");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Background Sync Example</h1>
        <h2>Count: {count}</h2>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <button onClick={handleSync}>Sync Count</button>
      </header>
    </div>
  );
}

export default App;


