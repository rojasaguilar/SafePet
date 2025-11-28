import { useNavigate } from 'react-router-dom';

function TablaUsuarios({ usuarios }) {
  const navigate = useNavigate();

  function capitalize(str) {
    return `${str[0].toUpperCase()}${str.slice(1, str.length)}`;
  }

  return (
    <>
      <div className="grid grid-cols-5 w-full bg-red-200 px-1.5 py-1">
        <p>Nombre</p>
        <p>Correo</p>
        <p>Telefono</p>
        <p>Rol</p>
        <p>Estado</p>
      </div>

      {usuarios.map((usuario) => (
        <div
          key={usuario.uid}
          className="grid grid-cols-5 w-full p-1.5 even:bg-gray-100 items-center"
          onClick={() => navigate(`/usuarios/${usuario.uid}`)}
        >
          <p>{`${capitalize(usuario.nombre)} ${capitalize(usuario.apellidos)}`}</p>
          <p>{capitalize(usuario.email)}</p>
          <p>{capitalize(usuario.telefono)}</p>
          <p>{capitalize(usuario.rol)}</p>
          {usuario.estado === true ? (
            <div className="px-1.5 py-1 bg-green-300 w-fit text-green-800 rounded-2xl">Activo</div>
          ) : (
            <div className="px-1.5 py-1 bg-gray-300 w-fit text-gray-800 rounded-2xl">Inactivo</div>
          )}
        </div>
      ))}
    </>
  );
}

export default TablaUsuarios;
