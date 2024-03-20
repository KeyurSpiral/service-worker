// src/App.js
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./screens/Home";
import Push from "./screens/Push";
import Screen3 from "./screens/Screen3";
import Location from "./screens/Location";

function App() {
  setInterval(() => {
    console.log("App")
  }, 1000);

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
