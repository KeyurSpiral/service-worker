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

  const [updateConfirmed, setUpdateConfirmed] = useState(false);

  useEffect(() => {
    const listener = (event) => {
      const message = event.detail.message;
      if (!updateConfirmed && window.confirm(message)) {
        window.location.reload();
      }
    };

    window.addEventListener("appUpdateAvailable", listener);

    return () => {
      window.removeEventListener("appUpdateAvailable", listener);
    };
  }, [updateConfirmed]);

  useEffect(() => {
    const confirmationListener = (event) => {
      if (event.data && event.data.type === "NEW_VERSION_CONFIRMATION") {
        const confirmationMessage = event.data.message;
        if (!updateConfirmed && window.confirm(confirmationMessage)) {
          setUpdateConfirmed(true);
          window.location.reload();
        }
      }
    };

    window.addEventListener("message", confirmationListener);

    return () => {
      window.removeEventListener("message", confirmationListener);
    };
  }, [updateConfirmed]);

  const [oldVersion, setOldVersion] = useState("");
  const [newVersion, setNewVersion] = useState("");

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
        <Route
          path="/version"
          element={
            <VersionInfo oldVersion={oldVersion} newVersion={newVersion} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
