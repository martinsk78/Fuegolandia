import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import MayoristaMenu from "./components/MayoristaMenu";
import MinoristaMenu from "./components/MinoristaMenu";
import FirstPage from "./components/FirstPage";
import HistorialVentas from "./components/HistorialVentas";

function App() {
  const [ventaEditada, setVentaEditada] = useState([]);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/minorista" element={<MinoristaMenu ventaEditada={ventaEditada} setVentaEditada={setVentaEditada} />} />
        <Route path="/mayorista" element={<MayoristaMenu ventaEditada={ventaEditada} setVentaEditada={setVentaEditada} />} />
        <Route path="/historial" element={<HistorialVentas setVentaEditada={setVentaEditada} />} />
      </Routes>
    </Router>
  );
}

export default App;
