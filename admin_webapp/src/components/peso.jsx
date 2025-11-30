import { Weight } from 'lucide-react';

function Peso({ peso }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
      <div className="flex flex-col justify-center items-center gap-1">
        <div className="bg-green-100 w-fit p-3.5 rounded-full">
          <Weight size={20} color="#aed789" />
        </div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">PESO</p>
        <p className="font-bold text-slate-700">{peso}</p>
      </div>
    </div>
  );
}

export default Peso;
