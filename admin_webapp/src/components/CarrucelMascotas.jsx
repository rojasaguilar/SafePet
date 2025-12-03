import ImagenMascota from './ImagenMascota.jsx';
import { PawPrint } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CarrucelMascotas({ mascotas }) {
  // useEffect(() => {}, []);
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
      {mascotas.map((pet, idx) => (
        <div
          key={idx}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
          onClick={() => navigate(`/pacientes/${pet.id}`)}
        >
          <ImagenMascota tipo={pet.tipo} />
          <div>
            <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{pet.nombre}</h4>
            <p className="text-xs text-slate-500">{pet.raza}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full uppercase font-bold">
              {pet.tipo}
            </span>
          </div>
        </div>
      ))}

      {/* Botón Agregar */}
      <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer min-h-[100px]">
        <PawPrint size={24} />
        <span className="text-sm font-medium">Agregar Mascota</span>
      </div>
    </div>
  );
}

export default CarrucelMascotas;
