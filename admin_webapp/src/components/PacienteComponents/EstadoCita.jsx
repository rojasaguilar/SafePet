import React from 'react';
import { Check, Clock, CircleX, Minus } from 'lucide-react';

function EstadoCita({ asistencia }) {
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const estatusDic = {
    asistio: (
      <div className="flex flex-row gap-1.5 items-center justify-center  px-2 py-1 rounded-xl bg-green-200">
        <Check size={18} color="#43a047" />
        <p className="text-sm text-green-700 "> {capitalize(asistencia)}</p>
      </div>
    ),
    pendiente: (
      <div className="flex flex-row gap-1.5 items-center justify-center  px-2 py-1 rounded-xl bg-yellow-200">
        <Clock size={18} color="#ffa000" />
        <p className="text-sm text-amber-700 "> {capitalize(asistencia)}</p>
      </div>
    ),
    'no asistio': (
      <div className="flex flex-row gap-1.5 p items-center justify-center x-2 py-1 rounded-xl bg-red-200">
        <CircleX size={18} color="#e53935" />
        <p className="text-sm text-red-700 "> {capitalize(asistencia)}</p>
      </div>
    ),
    cancelada: (
      <div className="flex flex-row gap-1.5 items-center justify-center  px-2 py-1 rounded-xl bg-gray-200">
        <Minus size={18} color="#757575" />
        <p className="text-sm text-gray-700 "> {capitalize(asistencia)}</p>
      </div>
    ),
  };

  return estatusDic[asistencia];
}

export default EstadoCita;
