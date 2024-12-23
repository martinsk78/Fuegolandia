import { React, useEffect, useState, useRef } from "react";
import cohetes from "../preciosMayorista.json";
import { db } from "../firebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import dragon from "../imgs/dragonGif.gif";
import { useNavigate } from "react-router-dom";
function MayoristaMenu({ ventaEditada, setVentaEditada }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cantidad, setCantidad] = useState(null);
  const [list, setList] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Índice seleccionado con teclado

  const [newCohete, setNewCohete] = useState(false);
  const [newCoheteName, setNewCoheteName] = useState("");
  const [newCohetePrice, setNewCohetePrice] = useState();
  const [newCoheteQuantity, setNewCoheteQuantity] = useState();

  const inputCoheteRef = useRef(null);
  const inputCantidadRef = useRef(null);
  const inputNewCoheteNameRef = useRef(null);
  const inputNewCohetePriceRef = useRef(null);
  const inputNewCoheteQuantityRef = useRef(null);

  const formRef = useRef(null);

  const [deletedCohete, setDeletedCohete] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && formRef.current) {
      }
    };
    window.addEventListener("keypress", handleKeyPress);
  }, []);

  useEffect(() => {
    if (ventaEditada) {
      setList(ventaEditada);
      console.log(ventaEditada)
    
    }
    return () => {
      setVentaEditada([]);
    };
  }, []);

  useEffect(() => {
    if (inputCoheteRef.current && deletedCohete === false) {
      inputCoheteRef.current.focus();
    } else {
      setDeletedCohete(false);
    }
  }, [list]);

  useEffect(() => {
    if (newCohete) {
      inputNewCoheteNameRef.current.focus();
    }
  }, [newCohete]);
  const handleForm = (e) => {
    e.preventDefault();
    if (search && cantidad) {
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
        setCantidad("");
        setMatches([]);
        setSelectedIndex(-1);
      }
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
        e.preventDefault();
        setSearch(matches[selectedIndex].name);
        setMatches([]);
        setSelectedIndex(-1);
        inputCantidadRef?.current.focus();
      }
    }
  };

  const handleMatchClick = (name) => {
    inputCantidadRef.current.focus();

    setSearch(name);
    setMatches([]);
    setSelectedIndex(-1);
  };

  // Función para remover un cohete de la lista
  const handleRemove = (name) => {
    setDeletedCohete(true);
    setList((prevList) => prevList.filter((cohete) => cohete.name !== name));
  };

  const handleVenta = async () => {
    if (list.length > 0) {
      try {
        // Generar una fecha_hora única para esta venta
        const fechaHora = ventaEditada.length > 0 ? ventaEditada[0].fecha_hora : `${new Date()}`;
        
        // Crear un lote de operaciones para optimizar las escrituras
        const batch = writeBatch(db);
  
        // Usamos un loop para agregar cada ítem con la misma fecha_hora al lote
        for (const item of list) {
          const venta = {
            fecha_hora: fechaHora, // Fecha compartida para todos los ítems de esta venta
            tipo: "Minorista",
            id_venta: uuidv4(),
            vendedor: localStorage.getItem("name"),
            ...item,
          };
  
          // Agregar la venta al lote
          const ventaRef = doc(collection(db, "ventas"));
          batch.set(ventaRef, venta);
          console.log("Venta preparada para guardar:", venta);
        }
  
        // Ejecutar el lote
        await batch.commit();
        console.log("Ventas guardadas con éxito");
      } catch (error) {
        console.error("Error al guardar la venta:", error);
      }
    }
  
    // Eliminar ventas existentes en `ventaEditada`
    if (ventaEditada.length > 0) {
      try {
        for (const venta of ventaEditada) {
          const fechaHora = venta.fecha_hora;
  
          // Buscar y eliminar documentos con la misma fecha_hora
          const ventaRef = query(
            collection(db, "ventas"),
            where('fecha_hora', '==', fechaHora)
          );
          const querySnapshot = await getDocs(ventaRef);
  
          // Eliminar los documentos encontrados
          querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
            console.log("Venta eliminada:", doc.id);
          });
        }
      } catch (error) {
        console.error("Error al eliminar las ventas:", error);
      }
    }
  
    // Limpiar el estado de `list` después de todas las operaciones
    setList([]);
  };
  
  
  
  
  

  const handleNewCohete = (e) => {
    e.preventDefault();
    if (newCoheteName && newCohetePrice && newCoheteQuantity) {
      setList([
        ...list,
        {
          name: newCoheteName,
          price: parseInt(newCohetePrice),
          cantidad: parseInt(newCoheteQuantity),
          precioTotal: parseInt(newCohetePrice) * parseInt(newCoheteQuantity),
        },
      ]);
      setNewCoheteName("");
      setNewCoheteQuantity(0);
      setNewCohetePrice(0);
      setNewCohete(false);
    }
  };
  return (
    <div className="flex items-center justify-center relative w-[100vw] h-full sm:h-[100vh] text-white">
      <img
        alt="fuegolandia dragon"
        src={dragon}
        className="absolute top-5 right-0 sm:right-16 w-[15rem] "
      />

      <div className="bg-black flex sm:p-10 w-full h-full sm:w-[90%] sm:h-[90%] bg-opacity-80">
        <div className="w-full h-full sm:flex-row flex-col flex gap-10">
          <div className="sm:w-1/2 flex flex-col ">
            <h1 className="text-4xl m-5">FUEGOLANDIA</h1>

            <div className="flex sm:flex-row flex-col justify-between w-full">
              <h2 className="text-3xl font-bold p-3 m-2 underline">
                Menu Mayorista
              </h2>
              <div className="flex">
                <button
                  onClick={() => navigate("/historial")}
                  className="text-xl     m-2 bg-red-800 hover:bg-red-700 px-1 sm:px-5 py-3 rounded text-white"
                >
                  Historial
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="text-xl bg-blue-800     hover:bg-blue-600 m-2 px-1 sm:px-5 py-3 rounded text-white"
                >
                  Menú Principal
                </button>
                <button
                  onClick={() => navigate("/minorista")}
                  className="text-xl  bg-green-800    hover:bg-green-700 m-2 px-1 sm:px-5 py-3 rounded text-white"
                >
                  Menú Minorista
                </button>
              </div>
            </div>
            <hr />
            <form
              onSubmit={handleForm}
              ref={formRef}
              className="text-4xl sm:mt-0 mt-10 gap-8 flex items-center flex-col w-full h-full justify-center"
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
                  ref={inputCoheteRef}
                  className="text-black p-2 text-xl border h-10 border-black relative w-full"
                />
                {matches.length > 0 && (
                  <div className="z-20 absolute top-10 left-0 w-full bg-white  text-black border border-gray-300 overflow-y-auto">
                    {matches.map((match, index) => (
                      <div
                        className={`flex items-center hover:bg-slate-500  ${
                          index === selectedIndex ? "bg-blue-200" : ""
                        }`}
                      >
                        <h3
                          key={index}
                          onClick={() => handleMatchClick(match.name)}
                          className="p-2 relative  w-full cursor-pointer text-xl"
                        >
                          {match.name}
                        </h3>
                        <h3
                          className={`text-xl p-2 text-black ${
                            index === selectedIndex ? "text-blue-600" : ""
                          } `}
                        >
                          ${match.price}
                        </h3>
                      </div>
                    ))}
                  </div>
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
                ref={inputCantidadRef}
                value={cantidad}
                className="text-black text-xl p-2 border h-10 border-black w-1/2"
              />
              <div className="relative w-full items-center justify-center flex flex-col sm:flex-row">
                <button
                  type="submit"
                  className="text-xl bg-blue-600 hover:bg-blue-700 m-2 px-5 py-3 rounded text-white"
                >
                  Ingresar
                </button>
                <button
                  className="text-xl left-0 sm:absolute bg-red-700 hover:bg-red-950 m-2 px-5 py-3 rounded text-white"
                  onClick={() => {
                    setNewCohete(true);
                  }}
                >
                  Ingresar cohete fuera de la lista
                </button>
              </div>
              <button
                onClick={handleVenta}
                className="text-3xl bg-green-600 hover:bg-green-700 m-2 px-5 py-3 rounded text-white"
              >
              {ventaEditada.length === 0 ? 'Agregar Venta' : 'Confimar Edicion'}
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
                    onClick={() => handleRemove(cohete.name)}
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
      {newCohete ? (
        <div className="absolute z-30 h-[100vh] flex items-center justify-center w-[100vw] bg-slate-800 bg-opacity-80 ">
          <div className="relative h-[70vh] w-[50vw] bg-slate-900 ">
            <form
              onSubmit={handleNewCohete}
              className="flex flex-col justify-center items-center h-full w-full gap-5 text-3xl"
            >
              <label htmlFor="nuevoCoheteNombre" className="m-3">
                Nombre del cohete
              </label>
              <input
                ref={inputNewCoheteNameRef}
                autoComplete="off"
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    inputNewCohetePriceRef.current.focus();
                  }
                }}
                name="nuevoCoheteNombre"
                onChange={(e) => setNewCoheteName(e.target.value)}
                id="nuevoCoheteNombre"
                value={newCoheteName}
                className="text-black text-xl p-2 border shadow-md shadow-white h-10 border-black w-1/2"
              />
              <label htmlFor="nuevoCohetePrecio" className="m-3">
                Precio
              </label>
              <input
                ref={inputNewCohetePriceRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    inputNewCoheteQuantityRef.current.focus();
                  }
                }}
                autoComplete="off"
                type="text"
                name="nuevoCohetePrecio"
                onChange={(e) => setNewCohetePrice(e.target.value)}
                id="nuevoCohetePrecio"
                value={newCohetePrice}
                className="text-black text-xl p-2 shadow-md shadow-white border h-10 border-black w-1/2"
              />
              <label htmlFor="nuevoCoheteCantidad" className="m-3">
                Cantidad
              </label>
              <input
                ref={inputNewCoheteQuantityRef}
                autoComplete="off"
                type="text"
                name="nuevoCoheteCantidad"
                onChange={(e) => setNewCoheteQuantity(e.target.value)}
                id="nuevoCoheteCantidad"
                value={newCoheteQuantity}
                className="text-black text-xl p-2 border shadow-md shadow-white  h-10 border-black w-1/2"
              />
              <button className="border rounded p-3" action="submit">
                Ingresar
              </button>
            </form>
            <icon
              className="text-white absolute top-2 text-4xl right-5 cursor-pointer"
              onClick={() => {
                setNewCohete(false);
              }}
            >
              X
            </icon>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default MayoristaMenu;
