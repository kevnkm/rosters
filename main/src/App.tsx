import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import League from "./pages/League";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:sport" element={<League />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
