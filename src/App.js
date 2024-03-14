import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const storedCount = localStorage.getItem("count");
    if (storedCount) {
      setCount(parseInt(storedCount));
    } else {
      fetchCount();
    }
  }, []);

  const fetchCount = () => {
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((response) => response.json())
      .then((data) => {
        setCount(data.id);
        localStorage.setItem("count", data.id);
      });
  };

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
    syncInBackground();
  };

  const decrement = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
      syncInBackground();
    }
  };

  const syncInBackground = () => {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready
        .then((registration) => {
          return registration.sync.register("syncCount");
        })
        .catch((err) => {
          console.error("Background sync registration failed:", err);
        });
    } else {
      console.log(
        "Service workers or background sync are not supported in this browser."
      );
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
