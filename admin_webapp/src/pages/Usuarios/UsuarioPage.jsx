// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ArrowLeft, User, Phone, Mail } from 'lucide-react';
// import CitasLista from '../../components/PacienteComponents/CitasLista';
// import CarrucelMascotas from '../../components/CarrucelMascotas';

// function UsuarioPage() {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Inicializar con un objeto que refleje la estructura esperada para evitar errores de acceso inicial
//   const [usuario, setUsuario] = useState(null); // Cambiado a null para un manejo de carga más claro
//   const [urlCitas, setUrlCitas] = useState('');
//   const [cargando, setCargando] = useState(true);
//   const [error, setError] = useState(null);

//   function capitalize(str) {
//     if (!str || typeof str !== 'string') return '';
//     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); // También convertimos el resto a minúsculas
//   }

//   // 1. Efecto para obtener el usuario
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         setCargando(true);
//         setError(null);
//         const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/usuarios/${id}`);
//         setUsuario(data.data);
//       } catch (err) {
//         console.error('Error al obtener el usuario:', err);
//         setError('No se pudo cargar la información del usuario.');
//       } finally {
//         setCargando(false);
//       }
//     };

//     // Solo se ejecuta si hay un ID
//     if (id) {
//       fetchUser();
//     }
//   }, [id]);

//   // 2. Efecto para establecer la URL de las citas
//   useEffect(() => {
//     // Si el usuario aún no está cargado o si el rol no está definido, salimos.
//     if (!usuario || !usuario.rol) return;

//     // **¡CORRECCIÓN CLAVE AQUÍ!**
//     // El rol en el backend es probablemente 'veterinario' (con la 'n'),
//     // pero en el código original estaba escrito como 'veteriario'.
//     if (usuario.rol === 'usuario') {
//       setUrlCitas(`${import.meta.env.VITE_BACKEND_URL_BASE}/citas?uid=${id}`);
//     } else if (usuario.rol === 'veterinario') {
//       // Corregido: 'veteriario' -> 'veterinario'
//       setUrlCitas(`${import.meta.env.VITE_BACKEND_URL_BASE}/citas?vet_id=${id}`);
//     } else {
//       // Manejar roles desconocidos si es necesario
//       setUrlCitas('');
//     }
//   }, [usuario, id]);

//   // Manejo de estados de carga y error
//   if (cargando) return <p>Cargando...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!usuario) return <p>Usuario no encontrado.</p>; // Si cargando es falso pero no hay usuario
//   console.log(`${import.meta.env.VITE_BACKEND_URL_BASE}/mascotas/?ui_dueno${id}`);
//   // Desestructuración para un código más limpio en el JSX
//   const { nombre, apellidos, telefono, email, uid } = usuario;
//   return (
//     <>
//       {/* HEADER */}
//       <div className="flex flex-row gap-3 items-center">
//         <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
//         <p className="text-xl font-medium">Detalles del Usuario</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-5">
//         {/* INFO PERFIL */}
//         <div className="flex flex-col gap-5">
//           {/* FOTO PERFIL */}
//           <div className="w-full h-38 bg-amber-500 flex justify-start items-end rounded-3xl">
//             {/* Usamos las iniciales del nombre como un placeholder simple */}
//             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative left-10 top-2 text-4xl font-bold text-amber-500 shadow-lg">
//               {`${nombre ? nombre[0] : ''}${apellidos ? apellidos[0] : ''}`.toUpperCase()}
//             </div>
//           </div>

//           {/* NOMBRE COMPLETO */}
//           {/* Se añade la verificación para asegurar que el usuario existe antes de intentar acceder a las propiedades */}
//           <p className="text-2xl font-semibold mt-6">{`${capitalize(nombre)} ${capitalize(apellidos)}`}</p>

//           {/* CONTACTO */}
//           <div className="flex flex-row gap-6">
//             {/* TELEFONO */}
//             <div className="flex flex-row items-center gap-2">
//               <div className="p-2 bg-blue-100 rounded-full text-blue-600">
//                 <Phone className="w-5 h-5" />
//               </div>
//               <div className="flex flex-col">
//                 <p className="text-gray-600 text-xs">Teléfono</p>
//                 <p className="font-medium">{telefono || 'N/A'}</p>
//               </div>
//             </div>

//             {/* CORREO */}
//             <div className="flex flex-row items-center gap-2">
//               <div className="p-2 bg-blue-100 rounded-full text-blue-600">
//                 <Mail className="w-5 h-5" />
//               </div>
//               <div className="flex flex-col">
//                 <p className="text-gray-600 text-xs">Correo</p>
//                 <p className="font-medium">{email || 'N/A'}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* TODAS LAS CITAS */}
//         <div className="lg:col-span-1">
//           <h3 className="text-xl font-semibold mb-4">
//             Citas {usuario.rol === 'veterinario' ? '' : 'para tus mascotas'}
//           </h3>
//           {/* Solo renderizamos CitasLista si hay una URL válida */}
//           {urlCitas ? <CitasLista url={urlCitas} /> : <p>No se encontró el rol del usuario para cargar las citas.</p>}
//         </div>
//       </div>

//       {/* CARRUCEL MASCOTAS */}
//       <div className="w-full ">
//         <CarrucelMascotas url={`${import.meta.env.VITE_BACKEND_URL_BASE}/mascotas/?ui_dueno=${id}`} />{' '}
//       </div>
//     </>
//   );
// }

// export default UsuarioPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  Stethoscope,
  Calendar,
  PawPrint,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// --- COMPONENTES MOCK (Para visualizar el diseño sin tus archivos locales) ---

const CitasListaMock = ({ tipo }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
        <Calendar className={tipo === 'veterinario' ? 'text-blue-500' : 'text-emerald-500'} size={20} />
        {tipo === 'veterinario' ? 'Agenda Asignada' : 'Historial de Citas'}
      </h3>
      <button className="text-sm text-blue-600 font-medium hover:underline">Ver todas</button>
    </div>

    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center bg-white p-3 rounded-lg shadow-sm min-w-[70px]">
            <span className="text-xs text-slate-400 uppercase font-bold">OCT</span>
            <span className="text-xl font-bold text-slate-800">{12 + i}</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-700">Vacunación Anual</h4>
            <div className="flex gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Clock size={12} /> 10:00 AM
              </span>
              <span className="flex items-center gap-1">
                <PawPrint size={12} /> Max
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Completada</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CarrucelMascotasMock = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[
      { nombre: 'Max', raza: 'Golden Retriever', tipo: 'Perro', color: 'bg-orange-100 text-orange-600' },
      { nombre: 'Luna', raza: 'Siamés', tipo: 'Gato', color: 'bg-purple-100 text-purple-600' },
    ].map((pet, idx) => (
      <div
        key={idx}
        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${pet.color}`}>
          {pet.nombre[0]}
        </div>
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

// --- COMPONENTE PRINCIPAL ---

function UsuarioPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || '3'; // ID por defecto para demo

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Utils
  const capitalize = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getRoleBadge = (rol) => {
    switch (rol) {
      case 'administrador':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-bold border border-purple-200">
            <Shield size={14} /> Administrador
          </span>
        );
      case 'veterinario':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold border border-blue-200">
            <Stethoscope size={14} /> Veterinario
          </span>
        );
      default: // cliente/usuario
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold border border-emerald-200">
            <User size={14} /> Cliente
          </span>
        );
    }
  };

  // Efecto de Carga
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setCargando(true);
        setError(null);

        // --- CÓDIGO REAL ---
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/usuarios/${id}`);
        setUsuario(data.data);
      } catch (err) {
        console.error('Error:', err);
        setError('No se pudo cargar la información del usuario.');
      } finally {
        setCargando(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Cargando perfil...</p>
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="bg-red-50 p-4 rounded-full inline-block mb-4 text-red-500">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Error</h3>
          <p className="text-slate-500 mb-6">{error || 'Usuario no encontrado'}</p>
          <button onClick={() => navigate(-1)} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-medium">
            Regresar
          </button>
        </div>
      </div>
    );
  }

  // Desestructuración
  const { nombre, apellidos, telefono, email, rol, direccion } = usuario;
  const nombreCompleto = `${capitalize(nombre)} ${capitalize(apellidos)}`;
  const iniciales = `${nombre ? nombre[0] : ''}${apellidos ? apellidos[0] : ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">Detalles del Usuario</h1>
          <p className="text-xs text-slate-400">ID: {usuario.uid}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* --- GRID PRINCIPAL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- COLUMNA IZQUIERDA: TARJETA DE PERFIL (Para todos los roles) --- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
              {/* Header visual con degradado según rol */}
              <div
                className={`h-32 w-full ${
                  rol === 'admin'
                    ? 'bg-linear-to-r from-purple-500 to-indigo-600'
                    : rol === 'veterinario'
                    ? 'bg-linear-to-r from-blue-500 to-cyan-500'
                    : 'bg-linear-to-r from-emerald-500 to-teal-500'
                }`}
              ></div>

              <div className="px-8 pb-8 relative text-center">
                {/* Avatar */}
                <div className="w-28 h-28 mx-auto -mt-14 bg-white rounded-full p-1.5 shadow-lg">
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center text-3xl font-bold text-white ${
                      rol === 'admin' ? 'bg-purple-500' : rol === 'veterinario' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}
                  >
                    {iniciales}
                  </div>
                </div>

                {/* Info Básica */}
                <div className="mt-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">{nombreCompleto}</h2>
                  <div className="mt-2 flex justify-center">{getRoleBadge(rol)}</div>
                </div>

                {/* Datos de Contacto */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-4 text-left">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-full text-slate-400 shadow-sm border border-slate-100">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Correo Electrónico</p>
                      <p className="text-slate-700 font-medium break-all">{email || 'No registrado'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-full text-slate-400 shadow-sm border border-slate-100">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Teléfono</p>
                      <p className="text-slate-700 font-medium">{telefono || 'No registrado'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-full text-slate-400 shadow-sm border border-slate-100">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Dirección</p>
                      <p className="text-slate-700 font-medium">{direccion || 'Sin dirección'}</p>
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                    <CheckCircle size={14} /> Usuario Activo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- COLUMNA DERECHA: CITAS (Solo Vets y Usuarios) --- */}
          {rol !== 'admin' && (
            <div className="lg:col-span-7">
              {/* Aquí iría tu componente <CitasLista url={...} /> */}
              {/* He usado el mock para que visualices el diseño */}
              <CitasListaMock tipo={rol} />
            </div>
          )}
        </div>

        {/* --- SECCIÓN INFERIOR: MASCOTAS (Solo Usuarios/Clientes) --- */}
        {rol === 'usuario' && (
          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PawPrint className="text-emerald-500" />
              Mascotas Registradas
            </h3>

            {/* Aquí iría tu componente <CarrucelMascotas url={...} /> */}
            <CarrucelMascotasMock />
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapper para previsualización
export default UsuarioPage;
