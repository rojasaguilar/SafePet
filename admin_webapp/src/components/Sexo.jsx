import { MarsIcon, VenusIcon } from 'lucide-react';

function Sexo({ sexo }) {
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
      {sexo === 'macho' ? (
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="bg-blue-100 w-fit p-3.5 rounded-full">
            <MarsIcon size={20} color="#2196f3" />
          </div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">SEXO</p>
          <p className="font-bold text-slate-700">{capitalize(sexo)}</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="bg-pink-100 w-fit p-3.5 rounded-full">
            <VenusIcon size={20} color="#ab47bc" />
          </div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">SEXO</p>
          <p className="font-bold text-slate-700">{capitalize(sexo)}</p>
        </div>
      )}
    </div>
  );
}

export default Sexo;
