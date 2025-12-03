import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, User } from 'lucide-react';

function CitasUsuario({ rol, id }) {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const fetchCitas = async () => {
      if (rol === 'veterinario') {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/citas?vet_id=${id}`);
        setCitas(data.data);
      } else if (rol === 'usuario') {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/citas?uid=${id}`);
        setCitas(data.data);
      }
    };
    fetchCitas();
  }, [id]);

  console.log(citas);

  if (citas.length < 1) return <p>Cargando...</p>;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <Calendar className="text-blue-500" size={20} />
          Historial de Citas
        </h3>
        <button className="text-sm text-blue-600 font-medium hover:underline">Ver todo</button>
      </div>

      <div className="space-y-4">
        {citas.map((cita) => (
          <div
            key={cita.cita_id}
            className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center bg-white p-3 rounded-lg shadow-sm min-w-20">
              <span className="text-xs text-slate-400 uppercase font-bold">{cita.fechaProgramada.split(' ')[1]}</span>
              <span className="text-xl font-bold text-slate-800">{cita.fechaProgramada.split(' ')[0]}</span>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="font-bold text-slate-700">{cita.motivo}</h4>
              <div className="flex gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {cita.hora}
                </span>
                <span className="flex items-center gap-1">
                  <User size={12} /> {cita.vet_nombre}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                {cita.asistencia}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CitasUsuario;
