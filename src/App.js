import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const storedCount = localStorage.getItem('count');
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
        saveCountToIndexedDB(data.id);
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
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('syncCount');
      }).catch(err => {
        console.error('Background sync registration failed:', err);
      });
    }
  };

  const saveCountToIndexedDB = (count) => {
    if (!('indexedDB' in window)) {
      console.log('IndexedDB is not supported in this browser.');
      return;
    }
  
    const request = window.indexedDB.open('countDB', 2); // Incrementing version number
  
    request.onerror = function(event) {
      console.error('IndexedDB error:', event.target.error);
    };
  
    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(['countStore'], 'readwrite');
      const objectStore = transaction.objectStore('countStore');
      objectStore.put({ id: 1, count }); // Specify an object with id property as key
    };
  
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore('countStore', { keyPath: 'id', autoIncrement: true }); // Set keyPath and autoIncrement
      objectStore.add({ id: 1, count }); // Specify an object with id property as key
    };
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
