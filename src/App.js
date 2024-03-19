// src/App.js
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load count from IndexedDB
    loadCountFromIndexedDB();
  }, []);

  const loadCountFromIndexedDB = () => {
    // Check if IndexedDB is supported
    if (!("indexedDB" in window)) {
      console.log("IndexedDB is not supported.");
      return;
    }

    // Open a connection to IndexedDB
    const request = window.indexedDB.open("myDatabase", 1);

    request.onerror = function (event) {
      console.log("IndexedDB error:", event.target.error);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("counts", "readonly");
      const objectStore = transaction.objectStore("counts");
      const getRequest = objectStore.get("count");

      getRequest.onerror = function (event) {
        console.log("Error loading count from IndexedDB:", event.target.error);
      };

      getRequest.onsuccess = function (event) {
        if (getRequest.result) {
          setCount(getRequest.result.value);
        }
      };
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore("counts", { keyPath: "id" });
      objectStore.add({ id: "count", value: 0 });
    };
  };

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    updateCountInIndexedDB(newCount);
    updateCountOnServer(newCount);
  };

  const decrement = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      updateCountInIndexedDB(newCount);
      updateCountOnServer(newCount);
    }
  };

  const updateCountInIndexedDB = (newCount) => {
    // Check if IndexedDB is supported
    if (!("indexedDB" in window)) {
      console.log("IndexedDB is not supported.");
      return;
    }

    // Open a connection to IndexedDB
    const request = window.indexedDB.open("myDatabase", 1);

    request.onerror = function (event) {
      console.log("IndexedDB error:", event.target.error);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("counts", "readwrite");
      const objectStore = transaction.objectStore("counts");
      const putRequest = objectStore.put({ id: "count", value: newCount });

      putRequest.onerror = function (event) {
        console.log("Error updating count in IndexedDB:", event.target.error);
      };
    };
  };

  const updateCountOnServer = (newCount) => {
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
            throw new Error("Service Unavailable");
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Failed to update count on server:", error);
          queueSync();
        });
    } else {
      queueSync();
    }
  };

  const queueSync = () => {
    if ("SyncManager" in window) {
      navigator.serviceWorker.ready
        .then(function (reg) {
          return reg.sync.register("myQueueName");
        })
        .catch(function (err) {
          console.log("Sync registration failed:", err);
        });
    } else {
      console.log("Background Sync is not supported.");
    }
  };

  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );

  const handlePushNotification = () => {
    if (notificationPermission === "granted") {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification("New Message", {
            body: "You have a new message!",
            icon: "/icon.png",
            badge: "/badge.png",
          });
        });
      }
    } else if (notificationPermission === "denied") {
      console.error("Permission for notifications was denied");
    } else {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
        if (permission === "granted") {
          // Permission granted, proceed to show notification
          handlePushNotification();
        } else {
          console.error("Permission for notifications was denied");
        }
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={decrement}>Decrement</button>
        <span>{error ? "Error: " + error : count}</span>
        <button onClick={increment}>Increment</button>

        <div>
          <h1>React Push Notification Example</h1>
          <button onClick={handlePushNotification}>Send Notification</button>
        </div>
      </header>
    </div>
  );
}

export default App;
