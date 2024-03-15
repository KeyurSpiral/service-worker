// src/app.js 
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Fetch initial count from fake API
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((response) => response.json())
      .then((data) => setCount(data.id));
  }, []);

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
    // Update fake API with new count
    fetch("https://jsonplaceholder.typicode.com/posts/1", {
      method: "PUT",
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
        method: "PUT",
        body: JSON.stringify({ id: count - 1 }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
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
