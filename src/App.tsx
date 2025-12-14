import "./App.css";
import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import League from "./pages/League";
import { ThemeProvider } from "@/components/ThemeProvider";

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <BrowserRouter basename="/rosters">
        <RedirectToLeague />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/league" element={<League />} />
          <Route path="/league/:sport" element={<League />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function RedirectToLeague() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/league/nba", { replace: true });
  }, [navigate]);

  return null;
}

export default App;
