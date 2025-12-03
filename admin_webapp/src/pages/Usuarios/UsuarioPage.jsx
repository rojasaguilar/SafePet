import CarrucelMascotas from '../../components/CarrucelMascotas.jsx';
import { useState, useEffect } from 'react';
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
import CitasUsuario from '../../components/UsariosComponents/CitasUsuario.jsx';

const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));



// --- COMPONENTE PRINCIPAL ---

function UsuarioPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || '3'; // ID por defecto para demo

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [mascotas, setMascotas] = useState([]);

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

  const fetchMascotas = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/mascotas?ui_dueno=${id}`, {
      headers: {
        'Content-Type': 'application/json',
        app: 'admin-webapp',
        Authorization: `Bearer ${loggedUser.idToken}`,
      },
    });
    setMascotas(data.data);
  };

  console.log(mascotas);

  const fetchUser = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/usuarios/${id}`);
    setUsuario(data.data);
  };

  // Efecto de Carga
  useEffect(() => {
    const loadData = async () => {
      try {
        setCargando(true);
        setError(null);

        await Promise.all([fetchUser(), fetchMascotas()]);
      } catch (err) {
        console.error('Error:', err);
        setError('No se pudo cargar la información del usuario.');
      } finally {
        setCargando(false);
      }
    };
    loadData();
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
              <CitasUsuario rol={usuario.rol} id={id}/>
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

            <CarrucelMascotas mascotas={mascotas} />
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapper para previsualización
export default UsuarioPage;
