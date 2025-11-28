import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Phone, Mail } from 'lucide-react';
import CitasLista from '../../components/PacienteComponents/CitasLista';
import CarrucelMascotas from '../../components/CarrucelMascotas';

function UsuarioPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Inicializar con un objeto que refleje la estructura esperada para evitar errores de acceso inicial
  const [usuario, setUsuario] = useState(null); // Cambiado a null para un manejo de carga más claro
  const [urlCitas, setUrlCitas] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  function capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); // También convertimos el resto a minúsculas
  }

  // 1. Efecto para obtener el usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setCargando(true);
        setError(null);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/usuarios/${id}`);
        setUsuario(data.data);
      } catch (err) {
        console.error('Error al obtener el usuario:', err);
        setError('No se pudo cargar la información del usuario.');
      } finally {
        setCargando(false);
      }
    };

    // Solo se ejecuta si hay un ID
    if (id) {
      fetchUser();
    }
  }, [id]);

  // 2. Efecto para establecer la URL de las citas
  useEffect(() => {
    // Si el usuario aún no está cargado o si el rol no está definido, salimos.
    if (!usuario || !usuario.rol) return;

    // **¡CORRECCIÓN CLAVE AQUÍ!**
    // El rol en el backend es probablemente 'veterinario' (con la 'n'),
    // pero en el código original estaba escrito como 'veteriario'.
    if (usuario.rol === 'usuario') {
      setUrlCitas(`${import.meta.env.VITE_BACKEND_URL_BASE}/citas?uid=${id}`);
    } else if (usuario.rol === 'veterinario') {
      // Corregido: 'veteriario' -> 'veterinario'
      setUrlCitas(`${import.meta.env.VITE_BACKEND_URL_BASE}/citas?vet_id=${id}`);
    } else {
      // Manejar roles desconocidos si es necesario
      setUrlCitas('');
    }
  }, [usuario, id]);

  // Manejo de estados de carga y error
  if (cargando) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!usuario) return <p>Usuario no encontrado.</p>; // Si cargando es falso pero no hay usuario
  console.log(`${import.meta.env.VITE_BACKEND_URL_BASE}/mascotas/?ui_dueno${id}`);
  // Desestructuración para un código más limpio en el JSX
  const { nombre, apellidos, telefono, email, uid } = usuario;
  return (
    <>
      {/* HEADER */}
      <div className="flex flex-row gap-3 items-center">
        <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
        <p className="text-xl font-medium">Detalles del Usuario</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-5">
        {/* INFO PERFIL */}
        <div className="flex flex-col gap-5">
          {/* FOTO PERFIL */}
          <div className="w-full h-38 bg-amber-500 flex justify-start items-end rounded-3xl">
            {/* Usamos las iniciales del nombre como un placeholder simple */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative left-10 top-2 text-4xl font-bold text-amber-500 shadow-lg">
              {`${nombre ? nombre[0] : ''}${apellidos ? apellidos[0] : ''}`.toUpperCase()}
            </div>
          </div>

          {/* NOMBRE COMPLETO */}
          {/* Se añade la verificación para asegurar que el usuario existe antes de intentar acceder a las propiedades */}
          <p className="text-2xl font-semibold mt-6">{`${capitalize(nombre)} ${capitalize(apellidos)}`}</p>

          {/* CONTACTO */}
          <div className="flex flex-row gap-6">
            {/* TELEFONO */}
            <div className="flex flex-row items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <p className="text-gray-600 text-xs">Teléfono</p>
                <p className="font-medium">{telefono || 'N/A'}</p>
              </div>
            </div>

            {/* CORREO */}
            <div className="flex flex-row items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <p className="text-gray-600 text-xs">Correo</p>
                <p className="font-medium">{email || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* TODAS LAS CITAS */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">
            Citas {usuario.rol === 'veterinario' ? '' : 'para tus mascotas'}
          </h3>
          {/* Solo renderizamos CitasLista si hay una URL válida */}
          {urlCitas ? <CitasLista url={urlCitas} /> : <p>No se encontró el rol del usuario para cargar las citas.</p>}
        </div>
      </div>

      {/* CARRUCEL MASCOTAS */}
      <div className="w-full ">
        <CarrucelMascotas url={`${import.meta.env.VITE_BACKEND_URL_BASE}/mascotas/?ui_dueno=${id}`} />{' '}
      </div>
    </>
  );
}

export default UsuarioPage;
