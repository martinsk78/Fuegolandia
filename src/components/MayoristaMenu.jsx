import { React, useState } from "react";
import cohetes from "../preciosMayorista.json";
function MayoristaMenu() {
  const [search, setSearch] = useState("");
  const [cantidad, setCantidad] = useState("");
  const todosLosCohetes = cohetes;
  const [list, setList] = useState([]);
  const [matches, setMatches] = useState([]);
  const handleForm = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center w-[100wv] h-[100vh] text-white">
      <div className="bg-black p-10 w-[90%] h-[90%] bg-opacity-80 ">
        <h1 className="text-4xl m-5"> FUEGOLANDIA </h1>
        <h2 className="text-2xl m-3">Menu Mayorista</h2>
        <hr />
        <div className="w-full grid grid-cols-2">
          <div className="w-full">
            <form
              onSubmit={handleForm}
              className="text-4xl gap-10 flex items-center flex-col w-full"
            >
              <label for="cohete" className=" m-3">
                Nombre del Cohete
              </label>
              <div className="w-1/2">
                <input
                  type="text"
                  name="cohete"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setMatches(["a"]);
                    setMatches(
                      todosLosCohetes.map((cohete) => {
                        console.log(matches)
                        if (
                          cohete.name.toLowerCase().includes(search.toLowerCase()) &&
                          search !== "" 
                        ) {
                          return cohete.name;
                        }

                        return null;
                      })
                    );
                  }}
                  id="cohete"
                  className="text-black text-xl border h-10 border-black relative w-full"
                />
                {matches.slice(0,3).map((match,i) => {
                    if(match){
                      return <>{match}</>
                    }
                  
                })}
              </div>
              <label for="cantidad" className=" m-3">
                Cantidad
              </label>
              <input
                type="text"
                name="cantidad"
                onChange={(e) => setCantidad(e.target.value)}
                id="cantidad"
                value={cantidad}
                className="text-black text-xl border h-10 border-black w-1/2"
              />
              <button
                action="submit"
                className="border bg-orange-950 py-3 px-5 rounded-lg hover:invert"
              >
                Ingresar
              </button>
            </form>
          </div>
          <div>
            {list.map((cohete) => {
              return (
                <>
                  <div className="grid grid-cols-2">
                    <h3 className="text-xl p-2 border border-white">
                      {cohete.name}
                    </h3>
                    <h3 className="border border-white w-32 text-center text-xl currenc ">
                      ${cohete.price}
                    </h3>
                  </div>
                </>
              );
            })}
            <div className="grid grid-cols-2">
              <h3 className="border text-2xl p-2 border-white">Total</h3>
              <h3 className="border border-white w-32 text-center text-xl">
                $
                {list.reduce((acc, curr) => {
                  return acc + curr.price;
                }, 0)}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MayoristaMenu;
