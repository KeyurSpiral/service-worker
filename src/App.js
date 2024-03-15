import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch initial count from fake API
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Service Unavailable");
        }
        return response.json();
      })
      .then((data) => setCount(data.id))
      .catch((error) => setError(error.message));
  }, []);

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
    // Update fake API with new count
    fetch("https://jsonplaceholder.typicode.com/posts/1", {
      method: "POST", // Change the method to POST for background sync
      body: JSON.stringify({ id: count + 1 }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  const decrement = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
      // Update fake API with new count
      fetch("https://jsonplaceholder.typicode.com/posts/1", {
        method: "POST", // Change the method to POST for background sync
        body: JSON.stringify({ id: count - 1 }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    }
  };

  const syncData = () => {
    if ('SyncManager' in window) {
      navigator.serviceWorker.ready
        .then(function(reg) {
          return reg.sync.register('myQueueName');
        })
        .catch(function(err) {
          console.log('Sync registration failed:', err);
        });
    } else {
      console.log('Background Sync is not supported.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={decrement}>Decrement</button>
        <span>{error ? "Error: " + error : count}</span>
        <button onClick={increment}>Increment</button>
        <button onClick={syncData}>Sync Data</button> {/* Button to trigger background sync */}
      </header>
    </div>
  );
}

export default App;
