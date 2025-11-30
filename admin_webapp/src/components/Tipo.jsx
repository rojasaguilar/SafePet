import React from 'react';
import { CatIcon, DogIcon } from 'lucide-react';

function Tipo({ tipo }) {
  return (
    <>
      {tipo === 'gato' ? (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
          <div className="flex flex-col justify-center items-center gap-1">
            <div className="bg-green-100 w-fit p-3.5 rounded-full">
              <CatIcon size={20} color="#aed581" />
            </div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">EDAD</p>
            <p className="font-bold text-slate-700">{tipo}</p>
          </div>
        </div>
      ) : (
         <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
          <div className="flex flex-col justify-center items-center gap-1">
            <div className="bg-green-100 w-fit p-3.5 rounded-full">
              <DogIcon size={20} color="#aed581" />
            </div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">EDAD</p>
            <p className="font-bold text-slate-700">{tipo}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Tipo;
