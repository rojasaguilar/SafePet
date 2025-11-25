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
    <>
      <div className="flex flex-col justify-center items-center gap-1">
        <div className="bg-white w-fit p-4 rounded-full">
          <Cake color="#aed581" />
        </div>
        <p>{getEdad()}</p>
      </div>
    </>
  );
}

export default Edad;
