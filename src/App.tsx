import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState<number>(0);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    setCount(count - 1);
  };

  const handleBackgroundSync = () => {
    // Trigger background sync here
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready
        .then((registration) => {
          return registration.sync.register("my-sync-tag");
        })
        .then(() => {
          console.log("Background sync registered.");
        })
        .catch((err) => {
          console.error("Background sync registration failed:", err);
        });
    } else {
      console.error("Background sync is not supported.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Background Sync Example</h1>
        <p>Count: {count}</p>
        <button onClick={incrementCount}>Add</button>
        <button onClick={decrementCount}>Remove</button>
        <button onClick={handleBackgroundSync}>Trigger Background Sync</button>
      </header>
    </div>
  );
}

export default App;
