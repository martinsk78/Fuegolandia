import { React, useEffect, useState } from "react";
import "./App.css";
import MayoristaMenu from "./components/MayoristaMenu";
import MinoristaMenu from "./components/MinoristaMenu";
import FirstPage from "./components/FirstPage";
import HistorialVentas from "./components/HistorialVentas";

function App() {
  const [menu, setMenu] = useState("");


  // Renderizado condicional fuera de una función anónima
  let content;
  if (menu === "minorista") {
    content = <MinoristaMenu setMenu={setMenu} />;
  } else if (menu === "mayorista") {
    content = <MayoristaMenu setMenu={setMenu} />;
  } else if(menu === "historial"){
    content = <HistorialVentas setMenu={setMenu} />;

  }else{
    content = <FirstPage setMenu={setMenu} />;
  }

  return <div>{content}</div>;
}

export default App;
