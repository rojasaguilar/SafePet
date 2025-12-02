import React from 'react';
import { Clock } from 'lucide-react';

function UpcomingAppointments({ citas }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Citas Proximas</h3>
        <button className="text-sm text-blue-600 font-medium hover:underline">Ver todas</button>
      </div>
      <div className="divide-y divide-slate-50">
        {citas.map((cita) => (
          <div
            key={cita.cita_id}
            className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                {cita.mascota_nombre[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{cita.mascota_nombre}</p>
                <p className="text-xs text-slate-500">{cita.motivo}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md mb-1">
                <Clock size={12} /> {cita.fechaProgramada} a las {cita.hora}
              </div>
              <p className="text-xs text-slate-400">{cita.vet_nombre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpcomingAppointments;
