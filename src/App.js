import { React, useEffect, useState } from "react";
import "./App.css";
import MayoristaMenu from "./components/MayoristaMenu";
import MinoristaMenu from "./components/MinoristaMenu";
import FirstPage from "./components/FirstPage";
import HistorialVentas from "./components/HistorialVentas";

function App() {
  const [menu, setMenu] = useState("");
  const [history, setHistory] = useState(() => {
    let recoverHistory = localStorage.getItem("historial");
    return recoverHistory ? JSON.parse(recoverHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem("historial", JSON.stringify(history));
    console.log(history);
  }, [history]);

  // Renderizado condicional fuera de una función anónima
  let content;
  if (menu === "minorista") {
    content = <MinoristaMenu setMenu={setMenu} setHistory={setHistory} />;
  } else if (menu === "mayorista") {
    content = <MayoristaMenu setMenu={setMenu} setHistory={setHistory} />;
  } else if(menu === "historial"){
    content = <HistorialVentas setMenu={setMenu} setHistory={setHistory} />;

  }else{
    content = <FirstPage setMenu={setMenu} />;
  }

  return <div>{content}</div>;
}

export default App;
