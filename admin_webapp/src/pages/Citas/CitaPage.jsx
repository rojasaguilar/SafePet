import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, BrowserRouter, replace } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  PawPrint,
  Trash2,
  MessageSquare,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Clock3,
  Mail,
  FileText,
  PencilIcon,
} from 'lucide-react';
import ActualizarCita from './ActualizarCita';

// --- COMPONENTE PRINCIPAL ---

function CitaPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener ID de la URL

  const [isLoading, setIsLoading] = useState(true);

  // Estado de la cita (inicializado en null)
  const [cita, setCita] = useState(null);

  const [isEditing, setEditing] = useState(false);

  // Efecto de Carga
  useEffect(() => {
    const fetchCita = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/citas/${id}`);
        setCita(data.data);
      } catch (error) {
        console.error('Error cargando cita:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCita();
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  // Utils Visuales
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completada':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmada':
        return <CheckCircle size={24} />;
      case 'completada':
        return <CheckCircle size={24} />;
      case 'cancelada':
        return <XCircle size={24} />;
      default:
        return <Clock3 size={24} />;
    }
  };

  console.log(cita);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (isEditing) return <ActualizarCita handleEditing={() => setEditing(false)} />;

  if (!cita) return <div className="p-8 text-center">Cita no encontrada</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-3">Detalle Cita #{cita.cita_id}</h1>
            <p className="text-xs text-slate-400">{cita.fechaCreacion}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            disabled={cita.asistencia !== 'pendiente'}
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-100 bg-white shadow-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
            title="Editar Cita"
          >
            <PencilIcon size={18} />
            <span className="font-medium">Editar Cita</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUMNA IZQUIERDA: RESUMEN VISUAL --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tarjeta Mascota */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <PawPrint size={64} className="text-slate-800" />
            </div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10">
              <PawPrint size={14} /> Paciente
            </h3>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-2xl font-bold text-blue-500 border border-blue-100">
                {cita.mascota_nombre ? cita.mascota_nombre[0] : '?'}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">{cita.mascota_nombre}</p>
                <p className="text-sm text-slate-500">
                  {cita.mascota_tipo} • {cita.mascota_raza}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta Cliente */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={14} /> Propietario
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-full">
                  <User size={20} className="text-slate-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{cita.dueno_nombre}</p>
                  <p className="text-xs text-slate-400">Cliente Registrado</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-50 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} className="text-blue-500" />
                  {cita.dueno_telefono}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-blue-500" />
                  <span className="truncate">{cita.dueno_email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Estado Actual */}
          <div className={`p-6 rounded-2xl border ${getStatusColor(cita.asistencia)} bg-opacity-50`}>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(cita.asistencia)}
              <h3 className="text-lg font-bold capitalize">{cita.asistencia}</h3>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              {cita.asistencia === 'pendiente' &&
                'La cita está programada pero requiere confirmación del especialista.'}
              {cita.asistencia === 'confirmada' && 'Todo listo. El cliente ha sido notificado de la fecha y hora.'}
              {cita.asistencia === 'completada' && 'La cita finalizó exitosamente.'}
              {cita.asistencia === 'cancelada' && 'La cita fue cancelada y no se llevará a cabo.'}
            </p>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: DETALLES DE LA CITA (SOLO LECTURA) --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileText className="text-blue-600" size={24} />
              Información de la Consulta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              {/* Fecha y Hora */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar size={12} /> Fecha Programada
                </label>
                <p className="text-md font-semibold text-slate-800">{cita.fechaProgramada}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={12} /> Hora
                </label>
                <p className="text-md font-semibold text-slate-800">{cita.hora}</p>
              </div>

              {/* Veterinario */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Stethoscope size={12} /> Veterinario Asignado
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Stethoscope size={20} />
                  </div>
                  <p className="text-lg font-medium text-slate-700">{cita.vet_nombre}</p>
                </div>
              </div>

              {/* Motivo */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Motivo de Consulta</label>
                <p className="text-base text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {cita.motivo}
                </p>
              </div>

              {/* Notas */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare size={12} /> Observaciones / Notas
                </label>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-900 text-sm leading-relaxed">
                  {cita.notas || 'Sin notas adicionales registradas para esta cita.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper para previsualización
export default CitaPage;
