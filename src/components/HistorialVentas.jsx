import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";

function HistorialVentas({ setMenu }) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ventas"));
        const fetchedData = querySnapshot.docs.map(doc => ({ 
          id: doc.id,  // Agregar el id del documento
          ...doc.data() 
        }));        const groupedItems = fetchedData.reduce((acc, item) => {
          const fechaHora = item.fecha_hora; // Usamos la fecha y hora completa como clave para agrupar

          if (!acc[fechaHora]) {
            acc[fechaHora] = [];
          }

          acc[fechaHora].push(item);
          return acc;
        }, {});
        const groupedItemsSorted = Object.keys(groupedItems)
          .sort((a, b) => new Date(a) - new Date(b)) // Comparar como fechas
          .reduce((sortedObj, key) => {
            sortedObj[key] = groupedItems[key];
            return sortedObj;
          }, {});

        setHistory(Object.values(groupedItemsSorted));
        console.log(history);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Recuperar el historial del estado local o del localStorage
  // Estado para manejar el día seleccionado
  const [selectedDate, setSelectedDate] = useState(new Date());

  const clearHistory = () => {
    // Limpiar el historial en el estado y en el localStorage
    localStorage.removeItem("historial");
    setHistory([]);
  };

  const handleDeleteVenta = async (venta) => {
    try {
      // Obtener el id del primer item de la venta (asumimos que todos los items de la venta tienen el mismo id)
      const ventaId = venta[0].id;

      // Eliminar el documento de la colección 'ventas'
      await deleteDoc(doc(db, 'ventas', ventaId));

      // Filtrar el historial localmente para eliminar la venta
      const newHistory = history.filter((ventaNoActual) => ventaNoActual[0].id !== venta[0].id);

      // Actualizar el estado con el historial filtrado
      setHistory(newHistory);

      console.log('Venta eliminada con éxito');
    } catch (error) {
      console.error('Error eliminando venta: ', error);
    }
  };

  const filterByDate = (venta) => {
    const ventaDate = new Date(venta[0].fecha_hora);
    return (
      ventaDate.getFullYear() === selectedDate.getFullYear() &&
      ventaDate.getMonth() === selectedDate.getMonth() &&
      ventaDate.getDate() === selectedDate.getDate()
    );
  };

  const changeDate = (days) => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + days);
      return newDate;
    });
  };

  const filteredHistory = history.filter(filterByDate);

  return (
    <div className="flex flex-col items-center justify-center w-[100vw] h-auto sm:h-[100vh] text-white ">
      <div className=" h-full w-full sm:w-[90vw] sm:h-[90vh] bg-black bg-opacity-80 flex items-center justify-center py-2 flex-col">
        <div className="flex  flex-col sm:flex-row relative w-full items-center justify-center">
          <h1 className="text-3xl sm:text-4xl  my-5">Historial de Ventas</h1>

          <div className="flex items-center justify-center my-3 sm:absolute right-20">
            <button
              onClick={() => changeDate(-1)}
              className="text-xl bg-blue-800 hover:bg-blue-900 px-3 py-2 rounded text-white mx-2"
            >
              ← Día Anterior
            </button>
            <h2 className="text-xl text-center">
              {selectedDate.toLocaleDateString()}
            </h2>
            <button
              onClick={() => changeDate(1)}
              className="text-xl bg-blue-800 hover:bg-blue-900 px-3 py-2 rounded text-white mx-2"
            >
              Día Siguiente →
            </button>
          </div>
        </div>
        <div className="overflow-y-auto bg-white text-black w-full  sm:w-[90%] h-[40rem]">
          {filteredHistory.length > 0 ? (
            <div className="flex flex-col">
              <table className="table-auto sm:text-xl text-sm w-full text-center border">
                <thead>
                  <tr>
                    <td className="border-2 font border-black bg-slate-500 text-white font-medium py-2">
                      Fecha y Hora
                    </td>
                    <td className="border-2 border-black bg-slate-500 text-white font-medium py-2">
                      Nombre
                    </td>
                    <td className="border-2 border-black bg-slate-500 text-white font-medium py-2">
                      Cantidad
                    </td>
                    <td className="border-2 border-black bg-slate-500 text-white font-medium py-2">
                      Precio Unitario
                    </td>
                    <td className="border-2 border-black bg-slate-500 text-white font-medium py-2">
                      Precio Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((venta, index) => (
                    <>
                      <tr className="relative">
                        <td
                          colSpan={4}
                          className="border-2 font-bold cursor-pointer px-4 py-2 border-black bg-yellow-400 text-black"
                        >
                          Venta {index + 1}
                        </td>
                        <td
                          onClick={() => handleDeleteVenta(venta)}
                          className="cursor-pointer bg-red-500 hover:bg-red-800 border-2 border-black"
                        >
                          X
                        </td>
                      </tr>
                      {venta.map((item, index) => {
                        return (
                          <tr key={item.fecha_hora}>
                            <td className="border border-black py-2 font-semibold">
                              {index === 0
                                ? new Date(item.fecha_hora).toLocaleString()
                                : ""}
                            </td>
                            <td className="border border-black py-2">
                              {item.name}
                            </td>
                            <td className="border border-black py-2">
                              {item.cantidad}
                            </td>
                            <td className="border border-black py-2">
                              ${item.price}
                            </td>
                            <td className="border border-black py-2">
                              ${item.precioTotal}
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td className="bg-blue-200 font-semibold border border-slate-500">
                          {new Date(venta[0].fecha_hora).getHours() >= 9 &&
                          new Date(venta[0].fecha_hora).getHours() < 13
                            ? "Turno Mañana"
                            : "Turno Tarde"}
                        </td>
                        <td className="bg-blue-200 font-semibold border border-slate-500">
                          {venta[0].tipo}
                        </td>
                        <td className="bg-blue-200 border border-slate-500 font-medium">
                          Ganancia (
                          {venta[0].tipo === "Mayorista" ? "30" : "70"}%) $
                          {Math.floor(
                            venta.reduce(
                              (acc, curr) => acc + curr.precioTotal,
                              0
                            ) / (venta[0].tipo === "Mayorista" ? 1.3 : 1.7) * (venta[0].tipo === "Mayorista" ? .3 : 0.7)
                          )}
                        </td>
                        <td className="border-2 bg-slate-700 text-white font-semibold border-black px-4 py-2">
                          Total Venta
                        </td>
                        <td className="border-2 text-white bg-slate-700 border-black px-4 py-2">
                          $
                          {venta.reduce(
                            (acc, curr) => acc + curr.precioTotal,
                            0
                          )}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xl text-center p-5">
              No hay ventas registradas para esta fecha.
            </p>
          )}
        </div>
        <div className="grid grid-cols-4 w-full text-2xl py-2 sm:w-1/2">
          <h3 className="text-center">Turno Mañana</h3>
          <h3 className="text-center">Turno Tarde</h3>
          <h3 className="text-center">Total Ganancia</h3>
          <h3 className="text-center">Total</h3>

          {/* Total de ventas para Turno Mañana */}
          <h3 className="text-center">
            $
            {filteredHistory
              .filter((venta) => {
                let hora = new Date(venta[0].fecha_hora).getHours();
                return hora >= 9 && hora < 13;
              })
              .reduce((acc, curr) => {
                let sum =
                  acc +
                  curr.reduce((acc, curr) => {
                    return acc + curr.precioTotal; // Sumar el precioTotal de cada item
                  }, 0);
                return sum;
              }, 0)}
          </h3>

          {/* Total de ventas para Turno Tarde */}
          <h3 className="text-center">
            $
            {filteredHistory
              .filter((venta) => {
                let hora = new Date(venta[0].fecha_hora).getHours();
                return hora >= 13 && hora < 22;
              })
              .reduce((acc, curr) => {
                let sum =
                  acc +
                  curr.reduce((acc, curr) => {
                    return acc + curr.precioTotal; // Sumar el precioTotal de cada item
                  }, 0);
                return sum;
              }, 0)}
          </h3>
          <h3 className="text-center">
            $
            {filteredHistory.reduce((acc, curr) => {
              let sum =
                acc +
                curr.reduce((accc, currr) => {
                  return accc + currr.precioTotal;
                }, 0) / (curr[0].tipo === "Mayorista" ? 1.3 : 1.7) * (curr[0].tipo === "Mayorista" ? .3 : 0.7)
              return Math.floor(sum);
            }, 0)}
          </h3>

          <h3 className="text-center">
            $
            {filteredHistory.reduce((acc, curr) => {
              let sum =
                acc +
                curr.reduce((acc, curr) => {
                  return acc + curr.precioTotal; // Sumar el precioTotal de cada item
                }, 0);
              return sum;
            }, 0)}
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row justify-between mt-5 w-full sm:w-[50%] space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setMenu("")}
            className="text-xl bg-blue-800 hover:bg-blue-900 px-5 py-3 rounded text-white w-full sm:w-auto"
          >
            Menú Principal
          </button>
          <button
            onClick={() => setMenu("minorista")}
            className="text-xl bg-green-600 hover:bg-green-700 px-5 py-3 rounded text-white w-full sm:w-auto"
          >
            Menú Minorista
          </button>
          <button
            onClick={() => setMenu("mayorista")}
            className="text-xl bg-yellow-600 hover:bg-yellow-700 px-5 py-3 rounded text-white w-full sm:w-auto"
          >
            Menú Mayorista
          </button>
          <button
            onClick={clearHistory}
            className="text-xl bg-red-800 hover:bg-red-700 px-5 py-3 rounded text-white w-full sm:w-auto"
          >
            Limpiar Historial
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistorialVentas;
