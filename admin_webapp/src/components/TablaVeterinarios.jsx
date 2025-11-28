import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function TablaVeterinarios({ veterinarios }) {
  const navigate = useNavigate();
  function capitalize(str) {
    return `${str[0].toUpperCase()}${str.slice(1, str.length)}`;
  }

  return (
    <>
      <div className="grid grid-cols-4 w-full bg-red-200 p-1">
        <p>Nombre</p>
        <p>Correo</p>
        <p>Telefono</p>
        <p>Estado</p>
      </div>
      {veterinarios.map((veterinario) => (
        <div
          key={veterinario.uid}
          className="grid grid-cols-4 w-full even:bg-gray-100 even:rounded-md p-1.5 items-center hover:scale-101"
          onClick={() => navigate(`/usuarios/${veterinario.uid}`)}
        >
          <p>{capitalize(veterinario.nombre)}</p>
          <p>{capitalize(veterinario.email)}</p>
          <p>{capitalize(veterinario.telefono)}</p>
          {veterinario.estado === true ? (
            <div className="px-1.5 py-1 bg-green-300 w-fit text-green-800 rounded-2xl">Activo</div>
          ) : (
            <div className="px-1.5 py-1 bg-gray-300 w-fit text-gray-800 rounded-2xl">Inactivo</div>
          )}
        </div>
      ))}
    </>
  );
}

export default TablaVeterinarios;
