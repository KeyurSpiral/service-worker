// src/App.js
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./screens/Home";
import Push from "./screens/Push";
import Screen2 from "./screens/Screen2";
import Screen3 from "./screens/Screen3";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/push" element={<Push />} />
        <Route path="/screen-2" element={<Screen2 />} />
        <Route path="/screen-3" element={<Screen3 />} />
      </Routes>
    </>
  );
}

export default App;
