import { Cake } from 'lucide-react';
import React from 'react';

function Edad({ fechaNacimiento }) {
  function getEdad() {
    const birthDay = new Date(fechaNacimiento);
    const currentDate = new Date();

    const birthYear = birthDay.getFullYear();
    const currentYear = currentDate.getFullYear();

    if (currentYear - birthYear > 0) return `${currentYear - birthYear} año`;

    const birthMonth = birthDay.getMonth();
    const currentMont = currentDate.getMonth();

    if (currentMont - birthMonth > 0) return `${currentMont - birthMonth} meses`;
  }

  getEdad();

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
      <div className="flex flex-col justify-center items-center gap-1">
        <div className="bg-green-100 w-fit p-3.5 rounded-full">
          <Cake size={20} color="#aed581" />
        </div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">EDAD</p>
        <p className="font-bold text-slate-700">{getEdad()}</p>
      </div>
    </div>
  );
}

export default Edad;
