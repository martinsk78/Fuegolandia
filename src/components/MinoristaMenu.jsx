import { React, useState } from "react";
import cohetes from "../preciosMayorista.json";

function MayoristaMenu({ setMenu, setHistory }) {
  const [search, setSearch] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [list, setList] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Índice seleccionado con teclado

  const handleForm = (e) => {
    e.preventDefault();
    const selectedCohete = cohetes.find(
      (cohete) => cohete.name.toLowerCase() === search.toLowerCase()
    );
    if (selectedCohete) {
      let repeatedIndex = list.findIndex((cohete) => {
        return cohete.name === selectedCohete.name;
      });
      if (repeatedIndex === -1) {
        setList([
          ...list,
          {
            ...selectedCohete,
            cantidad: parseInt(cantidad) || 1,
            precioTotal: (parseInt(cantidad) || 1) * selectedCohete.price,
          },
        ]);
      } else {
        setList((prevList) => {
          return prevList.map((cohete) => {
            return cohete.name === selectedCohete.name
              ? {
                  ...selectedCohete,
                  cantidad: parseInt(cantidad) + cohete.cantidad,
                  precioTotal:
                    (parseInt(cantidad) + cohete.cantidad) * cohete.price,
                }
              : cohete;
          });
        });
      }
      setSearch("");
      setCantidad(1);
      setMatches([]);
      setSelectedIndex(-1);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setSelectedIndex(-1); // Reinicia la selección con teclado

    if (value === "") {
      setMatches([]);
    } else {
      const filtered = cohetes.filter((cohete) =>
        cohete.name.toLowerCase().includes(value.toLowerCase())
      );
      setMatches(filtered);
    }
  };

  const handleKeyDown = (e) => {
    if (matches.length > 0) {
      if (e.key === "ArrowDown") {
        // Mueve la selección hacia abajo
        setSelectedIndex((prev) => (prev < matches.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        // Mueve la selección hacia arriba
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : matches.length - 1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        // Selecciona la opción con Enter
        setSearch(matches[selectedIndex].name);
        setMatches([]);
        setSelectedIndex(-1);
      }
    }
  };

  const handleMatchClick = (name) => {
    setSearch(name);
    setMatches([]);
    setSelectedIndex(-1);
  };

  // Función para remover un cohete de la lista
  const handleRemove = (name) => {
    setList((prevList) => prevList.filter((cohete) => cohete.name !== name));
  };

  const handleVenta = () => {
    if (list.length > 0) {
      setHistory((prevHistory) => {
        list[0].FechaYHora = new Date().toLocaleString() + "";
        list[0].Tipo = "Mayorista";

        return [...prevHistory, [...list]];
      });
      setList([]);
    }
  };

  return (
    <div className="flex items-center justify-center w-[100vw] h-full sm:h-[100vh] text-white">
      <div className="bg-black flex sm:p-10 w-[90%] h-[90%] bg-opacity-80">
        <div className="w-full h-full sm:flex-row flex-col flex gap-10">
          <div className="sm:w-1/2 flex flex-col ">
            <h1 className="text-4xl m-5">FUEGOLANDIA</h1>

            <div className="flex sm:flex-row flex-col justify-between w-full">
              <h2 className="text-2xl p-3 m-2">Menu Minorista</h2>
              <div className="flex">
                <button
                  onClick={() => setMenu("historial")}
                  className="text-xl     m-2 bg-red-600 hover:bg-red-700 px-1 sm:px-5 py-3 rounded text-white"
                >
                  Historial
                </button>
                <button
                  onClick={() => setMenu("")}
                  className="text-xl bg-blue-600     hover:bg-blue-700 m-2 px-1 sm:px-5 py-3 rounded text-white"
                >
                  Menú Principal
                </button>
                <button
                  onClick={() => setMenu("mayorista")}
                  className="text-xl bg-yellow-600    hover:bg-yellow-700 m-2 px-1 sm:px-5 py-3 rounded text-white"
                >
                  Menú Mayorista
                </button>
              </div>
            </div>
            <hr />
            <form
              onSubmit={handleForm}
              className="text-4xl gap-8 flex items-center flex-col w-full h-full justify-center"
            >
              <label htmlFor="cohete" className=" text-center">
                Nombre del Cohete
              </label>
              <div className="w-1/2 relative">
                <input
                  autoComplete="off"
                  type="text"
                  name="cohete"
                  value={search}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  id="cohete"
                  className="text-black p-2 text-xl border h-10 border-black relative w-full"
                />
                {matches.length > 0 && (
                  <ul className="absolute top-10 left-0 w-full bg-white text-black border border-gray-300 overflow-y-auto">
                    {matches.map((match, index) => (
                      <li
                        key={index}
                        onClick={() => handleMatchClick(match.name)}
                        className={`p-2 cursor-pointer text-xl ${
                          index === selectedIndex
                            ? "bg-gray-300"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        {match.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <label htmlFor="cantidad" className="m-3">
                Cantidad
              </label>
              <input
                                autoComplete="off"

                type="text"
                name="cantidad"
                onChange={(e) => setCantidad(e.target.value)}
                id="cantidad"
                value={cantidad}
                className="text-black text-xl p-2 border h-10 border-black w-1/2"
              />
              <button
                type="submit"
                className="text-xl bg-blue-600 hover:bg-blue-700 m-2 px-5 py-3 rounded text-white"
              >
                Ingresar
              </button>
              <button
                onClick={handleVenta}
                className="text-3xl bg-green-600 hover:bg-green-700 m-2 px-5 py-3 rounded text-white"
              >
                Agregar Venta
              </button>
            </form>
            <div className="flex items-center justify-center"></div>
          </div>
          <div className="flex flex-col sm:w-1/2">
            <div className=" overflow-y-auto h-full ">
              <button
                className="font-bold w-full h-20 text-red-700 border bg-red-300 border-red-400 hover:bg-red-400"
                onClick={() => setList([])}
              >
                Limpiar
              </button>
              <div className="bg-white  overscroll-y-auto text-black grid grid-cols-5">
                <h3 className="text-xl py-2 sm:p-2 border ">Nombre</h3>
                <h3 className="text-xl py-2 sm:p-2 border ">Cantidad</h3>
                <h3 className="text-xl py-2 sm:p-2 border ">Precio Unitario</h3>
                <h3 className="text-xl py-2 sm:p-2 border ">Precio Total</h3>
                <h3 className="bg-red-100"></h3>
              </div>
              {list.map((cohete, index) => (
                <div
                  key={index}
                  className="bg-white  overscroll-y-auto text-black grid grid-cols-5"
                >
                  <h3 className="text-xl py-2 sm:p-2 border ">{cohete.name}</h3>
                  <h3 className="border p-2 w-full text-center text-xl">
                    {cohete.cantidad}
                  </h3>
                  <h3 className="border p-2 w-full text-center text-xl">
                    ${cohete.price}
                  </h3>
                  <h3 className="border p-2 w-full text-center text-xl">
                    ${cohete.price * cohete.cantidad}
                  </h3>
                  <button
                    className="font-bold text-red-700 border bg-red-300 border-red-400 hover:bg-red-400"
                    onClick={() => handleRemove(cohete.name)} // Remover cohete al hacer clic
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-white text-black grid grid-cols-2 h-fit ">
              <h3 className="border text-2xl p-2 ">Total</h3>
              <h3 className="border w-full p-2 text-center text-xl">
                $
                {list.reduce(
                  (acc, curr) => acc + curr.price * curr.cantidad,
                  0
                )}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MayoristaMenu;
