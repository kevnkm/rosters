import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import League from "./pages/League";

function App() {
  return (
    <BrowserRouter basename="/rosters">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/league/:sport" element={<League />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
