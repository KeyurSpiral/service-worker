// src/App.js
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./screens/Home";
import Push from "./screens/Push";
import Screen3 from "./screens/Screen3";
import Location from "./screens/Location";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    window.addEventListener("appUpdateAvailable", (event) => {
      const message = event.detail.message;
      if (window.confirm(message)) {
        window.location.reload();
      }
    });

    return () => {
      window.removeEventListener("appUpdateAvailable");
    };
  }, []);

  return (
    <>
      <Header />
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
