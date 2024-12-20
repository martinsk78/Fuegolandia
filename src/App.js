import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import MayoristaMenu from "./components/MayoristaMenu";
import MinoristaMenu from "./components/MinoristaMenu";
import FirstPage from "./components/FirstPage";
import HistorialVentas from "./components/HistorialVentas";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/minorista" element={<MinoristaMenu />} />
        <Route path="/mayorista" element={<MayoristaMenu />} />
        <Route path="/historial" element={<HistorialVentas />} />
      </Routes>
    </Router>
  );
}

export default App;
