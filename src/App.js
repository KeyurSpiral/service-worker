// src/App.js
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./screens/Home";
import Push from "./screens/Push";
import Screen3 from "./screens/Screen3";
import Location from "./screens/Location";
import { useEffect, useState } from "react";

function App() {
  const [oldVersion, setOldVersion] = useState("");
  const [newVersion, setNewVersion] = useState("");

  useEffect(() => {
    // Function to handle messages from the service worker
    const handleServiceWorkerMessage = (event) => {
      if (event.data && event.data.type === "NEW_VERSION_AVAILABLE") {
        const newVersion = event.data.version;
        console.log(newVersion,"newVersion");
        setNewVersion(newVersion);
      }
    };

    // Add event listener to listen for messages from service worker
    window.addEventListener("message", handleServiceWorkerMessage);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("message", handleServiceWorkerMessage);
    };
  }, []);

  useEffect(() => {
    // Fetch old version from version.json file
    fetch("/version.json")
      .then((response) => response.json())
      .then((data) => {
        const oldVersion = data.version;
        setOldVersion(oldVersion);
      })
      .catch((error) => {
        console.error("Error fetching old version:", error);
      });
  }, []);

  return (
    <>
      <Header />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <h1>Old Version: {oldVersion}</h1>
        <h1>New Version: {newVersion}</h1>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/push" element={<Push />} />
        <Route path="/location" element={<Location />} />
        <Route path="/screen-3" element={<Screen3 />} />
      </Routes>
    </>
  );
}

export default App;
