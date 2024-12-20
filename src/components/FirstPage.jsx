import React, { useState, useEffect } from "react";
import dragon from "../imgs/dragonGif.gif";
import { useNavigate } from "react-router-dom";

function FirstPage() {
  const navigate = useNavigate();

  // Lista de nombres permitidos
  const allowedNames = ["Martin", "Pablo", "Abby", "Ana", "Eli", "Graci","Leo", "Brisa", "Leon"];

  // Estados
  const [name, setName] = useState(() => localStorage.getItem("name") || "");
  const [isNameSet, setIsNameSet] = useState(!!localStorage.getItem("name"));
  const [isBlocked, setIsBlocked] = useState(
    () => localStorage.getItem("isBlocked") === "true"
  );

  useEffect(() => {
    if (isBlocked) {
      alert("Acceso bloqueado. No puedes ingresar.");
    }
  }, [isBlocked]);

  const handleForm = (e) => {
    e.preventDefault();

    // Validar si el nombre está permitido
    if (!allowedNames.includes(name)) {
      localStorage.setItem("isBlocked", "true");
      setIsBlocked(true);
      return;
    }

    // Si el nombre es válido, permitir acceso
    localStorage.setItem("name", name);
    setIsNameSet(true);
  };

  if (isBlocked) {
    return (
      <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-red-600 text-white text-3xl">
        Acceso bloqueado. No puedes ingresar.
      </div>
    );
  }

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center relative">
      <img
        alt="fuegolandia dragon"
        src={dragon}
        className="absolute top-5 right-16 w-[25rem]"
      />
      {!isNameSet && (
        <div className="h-[50vh] w-[40vw] bg-black bg-opacity-80 absolute flex items-center justify-center">
          <form
            onSubmit={handleForm}
            className="w-full flex flex-col items-center justify-center gap-16"
          >
            <h2 className="text-white text-5xl">Ingrese su nombre:</h2>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              autoComplete="off"
              className="text-2xl w-1/2 p-2"
              placeholder="Escribe tu nombre"
              aria-label="Nombre"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-2xl"
            >
              Confirmar
            </button>
          </form>
        </div>
      )}
      {isNameSet && (
        <div className="bg-black bg-opacity-80 h-[90vh] w-[90vw] flex items-center justify-center flex-col px-4">
          <h2 className="text-[3.3rem] sm:text-[7rem] md:text-[10rem] text-center text-white font-serif p-0 m-0">
            FuegoLandia
          </h2>
          <h3 className="text-[1.5rem] sm:text-[2rem] md:text-[3rem] text-center text-white font-serif">
            Sistema contable
          </h3>
          <div className="gap-5 flex flex-col sm:flex-row mt-12 mb-20">
            <button
              onClick={() => navigate("/minorista")}
              className="text-2xl sm:text-4xl bg-green-800 hover:bg-green-700 px-5 py-3 rounded text-white"
            >
              Menú Minorista
            </button>
            <button
              onClick={() => navigate("/mayorista")}
              className="text-2xl sm:text-4xl bg-yellow-600 hover:bg-yellow-700 px-5 py-3 rounded text-white"
            >
              Menú Mayorista
            </button>
          </div>
          <button
            onClick={() => navigate("/historial")}
            className="text-2xl sm:text-4xl bg-red-800 hover:bg-red-700 px-5 py-3 rounded text-white"
          >
            Historial
          </button>
        </div>
      )}
    </div>
  );
}

export default FirstPage;
