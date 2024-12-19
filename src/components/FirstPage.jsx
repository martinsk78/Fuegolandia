import React from 'react';

function FirstPage({ setMenu }) {
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="bg-black bg-opacity-80 h-[90vh] w-[90vw] flex items-center justify-center flex-col px-4">
        <h2 className="text-[3.3rem] sm:text-[7rem] md:text-[10rem] text-center text-white font-serif p-0 m-0">
          FuegoLandia
        </h2>
        <h3 className="text-[1.5rem] sm:text-[2rem] md:text-[3rem] text-center text-white font-serif">
          Sistema contable
        </h3>
        <div className="gap-5 flex flex-col sm:flex-row mt-12 mb-20">
          <button
            onClick={() => setMenu("minorista")}
            className="text-2xl sm:text-4xl bg-green-800 hover:bg-green-700 px-5 py-3 rounded text-white"
          >
            Menú Minorista
          </button>
          <button
            onClick={() => setMenu("mayorista")}
            className="text-2xl sm:text-4xl bg-yellow-600 hover:bg-yellow-700 px-5 py-3 rounded text-white"
          >
            Menú Mayorista
          </button>
        </div>
        <button
          onClick={() => setMenu("historial")}
          className="text-2xl sm:text-4xl bg-red-800 hover:bg-red-700 px-5 py-3 rounded text-white"
        >
          Historial
        </button>
      </div>
    </div>
  );
}

export default FirstPage;
