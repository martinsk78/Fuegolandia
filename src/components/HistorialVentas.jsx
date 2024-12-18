import React from "react";

function HistorialVentas({ setMenu, setHistory }) {
  // Recuperar el historial del estado local o del localStorage
  const history = JSON.parse(localStorage.getItem("historial")) || [];

  const clearHistory = () => {
    // Limpiar el historial en el estado y en el localStorage
    localStorage.removeItem("historial");
    setHistory([]);
  };

  const handleDeleteVenta = (venta) => {
    // Filtrar las ventas que no coinciden con la venta que queremos eliminar
    const newHistory = history.filter((ventaNoActual) => {
      return ventaNoActual[0].FechaYHora !== venta[0].FechaYHora;
    });

    // Actualizar el estado y el localStorage con el historial filtrado
    localStorage.setItem("historial", JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  return (
    <div className="flex flex-col items-center justify-center w-[100vw] h-[100vh] text-white px-4">
      <div className="w-[90vw] h-[90vh] bg-black bg-opacity-80 flex items-center justify-center flex-col">
        <h1 className="text-3xl sm:text-4xl mb-5">Historial de Ventas</h1>
        <div className="overflow-y-auto bg-white text-black w-full sm:w-[90%] h-[70%]">
          {history.length > 0 ? (
            <div className="flex flex-col">
              <table className="table-auto text-xl w-full text-center border">
                <thead>
                  <tr>
                    <td className="border-2 font border-black bg-amber-200 py-2">
                      Fecha y Hora
                    </td>
                    <td className="border-2 border-black bg-red-200 py-2">
                      Nombre
                    </td>
                    <td className="border-2 border-black bg-green-200 py-2">
                      Cantidad
                    </td>
                    <td className="border-2 border-black bg-cyan-200 py-2">
                      Precio Unitario
                    </td>
                    <td className="border-2 border-black bg-indigo-200 py-2">
                      Precio Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {history.map((venta, index) => (
                    <>
                      <tr className="relative">
                        <td
                          colSpan={4}
                          className="border-2 cursor-pointer px-4 py-2 border-black bg-green-200"
                        >
                          Venta {index + 1}
                        </td>
                        <td
                          onClick={() => handleDeleteVenta(venta)}
                          className="cursor-pointer bg-red-500 hover:bg-red-600 border-2 border-black"
                        >
                          X
                        </td>
                      </tr>
                      {venta.map((item) => {
                        return (
                          <tr key={item.FechaYHora}>
                            <td className="border border-black py-2">
                              {item.FechaYHora
                                ? new Date(item.FechaYHora).toLocaleString()
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
                        <td className="bg-blue-200 border border-slate-500">
                          {new Date(venta[0].FechaYHora).getHours() >= 9 &&
                          new Date(venta[0].FechaYHora).getHours() < 13
                            ? "Turno Mañana"
                            : "Turno Tarde"}
                        </td>
                        <td className="bg-blue-200 border border-slate-500">
                          {venta[0].Tipo}
                        </td>
                        <td className="bg-blue-200 border border-slate-500"></td>
                        <td className="border-2 border-black px-4 py-2">
                          Total Venta
                        </td>
                        <td className="border-2 border-black px-4 py-2">
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
              No hay ventas registradas en el historial.
            </p>
          )}
        </div>
        <div className="grid grid-cols-3 text-2xl py-2 w-1/2">
          <h3 className="text-center">Turno Mañana</h3>
          <h3 className="text-center">Turno Tarde</h3>
          <h3 className="text-center">Total</h3>

          {/* Total de ventas para Turno Mañana */}
          <h3 className="text-center">
            $
            {history
              .filter((venta) => {
                let hora = new Date(venta[0].FechaYHora).getHours();
                return hora > 9 && hora < 13;
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
            {history
              .filter((venta) => {
                let hora = new Date(venta[0].FechaYHora).getHours();
                return hora > 17 && hora < 21;
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
            {history.reduce((acc, curr) => {
              let sum =
                acc +
                curr.reduce((acc, curr) => {
                  return acc + curr.precioTotal; // Sumar el precioTotal de cada item
                }, 0);
              return sum;
            }, 0)}
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row justify-between mt-5 w-full sm:w-[90%] space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setMenu("")}
            className="text-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded text-white w-full sm:w-auto"
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
            className="text-xl bg-red-600 hover:bg-red-700 px-5 py-3 rounded text-white w-full sm:w-auto"
          >
            Limpiar Historial
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistorialVentas;
