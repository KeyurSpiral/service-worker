// App.js

import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchCount();
  }, []);

  const fetchCount = () => {
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((response) => response.json())
      .then((data) => setCount(data.id))
      .catch((error) => console.error("Error fetching count:", error));
  };

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
    registerBackgroundSync();
  };

  const decrement = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
      registerBackgroundSync();
    }
  };

  const registerBackgroundSync = () => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready
        .then(function(registration) {
          return registration.sync.register('syncCount');
        })
        .catch(function(err) {
          console.log('Background sync registration failed:', err);
        });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={decrement}>Decrement</button>
        <span>{count}</span>
        <button onClick={increment}>Increment</button>
      </header>
    </div>
  );
}

export default App;
