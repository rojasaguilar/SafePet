import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Descomentar en producción
import { ArrowLeft, Mail, Phone, User, Edit2, FileText } from 'lucide-react';

import Sexo from './../../components/Sexo.jsx';
import Peso from '../../components/peso.jsx';
import Edad from '../../components/Edad.jsx';

import CitasLista from '../../components/PacienteComponents/CitasLista.jsx';
import Tipo from '../../components/Tipo.jsx';
import ActualizarPaciente from './ActualizarPaciente.jsx';

function PacientePage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || '1';

  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setEditing] = useState(false);

  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const getMascota = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/mascotas/${id}`);
        setMascota(data.data);
      } catch (error) {
        console.error('Error cargando mascota', error);
      } finally {
        setLoading(false);
      }
    };

    getMascota();
  }, [id]);

  const goBack = () => navigate('/pacientes');

  const handleEdit = () => {
    setEditing(true);
  };

  console.log(mascota);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!mascota) return <div className="p-8 text-center">No se encontró la mascota.</div>;

  if (isEditing) return <ActualizarPaciente handleEditing={() => setEditing(false)} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Detalles del Paciente</h1>
        </div>

        <button
          onClick={handleEdit}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Edit2 size={18} />
          <span className="hidden sm:inline">Editar</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid lg:grid-cols-12 gap-8">
        {/* --- COLUMNA IZQUIERDA: PERFIL Y DATOS --- */}
        <div className="lg:col-span-4 space-y-6">
          {/* TARJETA DE PERFIL */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
            {/* Banner Fondo */}
            {/* <div className={`h-32 w-full ${mascota.tipo === 'gato' ? 'bg-purple-100' : 'bg-orange-100'}`}></div> */}

            <div className="px-6 pb-6 flex flex-col">
              {/* Avatar Mascota */}
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-slate-200 self-center">
                <img
                  src={mascota.imagen || `/src/assets/${mascota.tipo}.jpg`}
                  alt={mascota.nombre}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=Pet';
                  }}
                />
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-3xl font-bold text-slate-800">{capitalize(mascota.nombre)}</h2>
                <p className="text-slate-500 font-medium">{mascota.raza}</p>
                <div className="flex justify-center gap-2 mt-3">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold uppercase">
                    ID: {mascota.id}
                  </span>
                </div>
              </div>

              {/* Grid de Atributos (Sexo, Peso, etc.) */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                <Sexo sexo={mascota.sexo} />
                <Peso peso={mascota.peso} />
                <Edad fechaNacimiento={mascota.fechaNacimiento} />
                <Tipo tipo={mascota.tipo} />
              </div>
            </div>
          </div>

          {/* TARJETA DE DUEÑO */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User className="text-blue-500" size={20} />
              Información del Dueño
            </h3>

            <div className="space-y-4">
              {/* Nombre */}
              <div
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => navigate(`/usuarios/${mascota.ui_dueno}`)}
              >
                <div className="bg-blue-100 p-2.5 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Nombre Completo</p>
                  <p className="text-slate-700 font-semibold">{mascota.nombre_dueno}</p>
                </div>
              </div>

              {/* Teléfono */}
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="bg-green-100 p-2.5 rounded-full text-green-600">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Teléfono</p>
                  <p className="text-slate-700 font-semibold">{mascota.telefono_dueno}</p>
                </div>
              </div>

              {/* Correo */}
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="bg-orange-100 p-2.5 rounded-full text-orange-600">
                  <Mail size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-slate-400 font-medium">Correo Electrónico</p>
                  <p className="text-slate-700 font-semibold truncate">{mascota.correo_dueno}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: HISTORIAL Y CITAS --- */}
        <div className="lg:col-span-8 space-y-6">
          {/* Aquí integramos tu componente CitasLista (simulado) */}
          <CitasLista mascotaId={id} />

          {/* Placeholder para otras secciones (Historial médico, notas, etc.) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center justify-center text-center py-12 border-dashed border-2">
            <div className="bg-slate-50 p-4 rounded-full mb-3">
              <FileText className="text-slate-300" size={32} />
            </div>
            <h4 className="text-slate-600 font-medium">Historial Médico Completo</h4>
            <p className="text-slate-400 text-sm max-w-xs mt-1">
              Próximamente podrás ver vacunas, cirugías y tratamientos aquí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PacientePage;
