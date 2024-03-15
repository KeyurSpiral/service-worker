// src/app.js
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((response) => response.json())
      .then((data) => setCount(data.id));
  }, []);

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
    updateCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
      updateCount(count - 1);
    }
  };

  const updateCount = (newCount) => {
    if (navigator.onLine) {
      fetch("https://jsonplaceholder.typicode.com/posts/1", {
        method: "PUT",
        body: JSON.stringify({ id: newCount }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => console.log("Updated count:", data.id))
        .catch((error) => {
          console.error("Error updating count:", error);
          // Queue failed request for background sync
          if ("serviceWorker" in navigator && "SyncManager" in window) {
            navigator.serviceWorker.ready
              .then((swRegistration) => {
                return swRegistration.sync.register("syncCountUpdate");
              })
              .catch((err) =>
                console.error("Service Worker registration failed:", err)
              );
          }
        });
    } else {
      // Queue failed request for background sync
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready
          .then((swRegistration) => {
            return swRegistration.sync.register("syncCountUpdate");
          })
          .catch((err) =>
            console.error("Service Worker registration failed:", err)
          );
      }
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
