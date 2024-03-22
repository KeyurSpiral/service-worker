// src/App.js
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./screens/Home";
import Push from "./screens/Push";
import Location from "./screens/Location";
import { useEffect, useState } from "react";
import VersionInfo from "./screens/VersionInfo";

function App() {
  useEffect(() => {
    window.addEventListener("appUpdateAvailable", (event) => {
      console.log("EVENT APP.JS : ", event.detail);
      const message = event.detail.message;
      if (window.confirm(message)) {
        window.location.reload();
      }
    });

    return () => {
      window.removeEventListener("appUpdateAvailable");
    };
  }, []);

  const [oldVersion, setOldVersion] = useState("");
  const [newVersion, setNewVersion] = useState("");

  console.log(process.env.REACT_APP_VERSION, "process.env.REACT_APP_VERSION");
  useEffect(() => {
    const oldVersionFromEnv = process.env.REACT_APP_VERSION;
    setOldVersion(oldVersionFromEnv);
 
    fetch("/version.json")
      .then((response) => response.json())
      .then((data) => {
        const newVersionFromJson = data.version;
        setNewVersion(newVersionFromJson);
      })
      .catch((error) => {
        console.error("Error fetching new version:", error);
      });
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/push" element={<Push />} />
        <Route path="/location" element={<Location />} />
        <Route path="/version" element={<VersionInfo oldVersion={oldVersion} newVersion={newVersion} />} />
      </Routes>
    </>
  );
}

export default App;
