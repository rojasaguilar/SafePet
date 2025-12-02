import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  PawPrint,
  Save,
  Trash2,
  MessageSquare,
  MapPin,
  Phone,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock3,
  Mail,
  DogIcon,
} from 'lucide-react';

function ActualizarCita({ handleEditing }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estado del formulario
  const [cita, setCita] = useState(null);

  // Listas para selects (Mock)
  const [veterinarios, setVeterinarios] = useState([]);

  const meses = {
    enero: '00',
    febrero: '01',
    marzo: '02',
    abril: '03',
    mayo: '04',
    junio: '05',
    julio: '06',
    agosto: '07',
    septiembre: '08',
    octubre: '09',
    noviembre: '10',
    diciembre: '11',
  };

  console.log(cita);

  // Efecto de Carga
  useEffect(() => {
    const fetchCita = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/citas/${id}`);
        //   //   console.log(new Date(cita.fechaProgramada.toI));
        const [dia, , mes, , anio] = data.data.fechaProgramada.split(' ');

        const date = `${anio}-${meses[mes]}-${dia}`;
        let hora = data.data.hora.slice(0, 5).trim();
        if (hora.length < 5) hora = `0${hora}`;

        // console.log(date)
        setCita({
          ...data.data,
          fechaProgramada: date,
          hora,
        });
        // fetchVets();
      } catch (error) {
        console.error('Error cargando cita:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCita();
  }, []);

  console.log(cita)

  // Manejadores
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCita((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fechaCompleta = new Date(`${cita.fechaProgramada}T${cita.hora}`);
      console.log(fechaCompleta);
      const updated = await axios.patch(`${import.meta.env.VITE_BACKEND_URL_BASE}/citas/${id}`, {
        ...cita,
        fechaProgramada: fechaCompleta.toISOString(),
      });
      if (updated.status === 200) {
        alert('si se actualizó');
      }
      navigate(-1);
    } catch (error) {
      console.error('Error guardando:', error);
    } finally {
      setIsSaving(false);
    }
  };

  console.log(cita);

  const handleDelete = () => {
    if (confirm('¿Estás seguro de cancelar y eliminar esta cita?')) {
      console.log('Eliminando...');
      navigate(-1);
    }
  };

  // Utils Visuales
  const getStatusColor = (status) => {
    switch (status) {
      case 'no asistio':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'asistio':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pendiente':
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-3">Cita #{cita.cita_id}</h1>
            <p className="text-xs text-slate-400">Creada el 20 Oct 2023</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleEditing}
            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
            title="Cancelar"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-70"
          >
            {isSaving ? (
              'Guardando...'
            ) : (
              <>
                <Save size={18} /> Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUMNA IZQUIERDA: INFORMACIÓN VISUAL --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tarjeta Mascota */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <PawPrint size={14} /> Paciente
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-400">
                {cita.mascota_nombre[0]}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">{cita.mascota_nombre}</p>
                <p className="text-sm text-slate-500">
                  {cita.mascota_tipo} • {cita.mascota_raza}
                </p>
                {/* <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-md">
                  {cita.mascota.edad}
                </span> */}
              </div>
            </div>
          </div>

          {/* Tarjeta Cliente */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={14} /> Propietario
            </h3>
            <div className="space-y-3">
              <p className="font-bold text-slate-800 text-lg">{cita.dueno_nombre}</p>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={16} className="text-blue-500" />
                {cita.dueno_telefono}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={16} className="text-blue-500" />
                <span>{cita.dueno_email}</span>
              </div>
            </div>
          </div>

          {/* Estado Actual (Visual) */}
          <div className={`p-6 rounded-2xl border ${getStatusColor(cita.asistencia)} bg-opacity-50`}>
            <div className="flex items-center gap-3 mb-2">
              {cita.asistencia === 'pendiente' && <Clock3 size={24} />}
              {cita.asistencia === 'no asistio' && <DogIcon size={24} />}
              {cita.asistencia === 'cancelada' && <XCircle size={24} />}
              {cita.asistencia === 'completada' && <CheckCircle size={24} />}
              <h3 className="text-lg font-bold capitalize">{cita.asistencia}</h3>
            </div>
            <p className="text-sm opacity-80">
              {cita.asistencia === 'pendiente' && 'Esperando confirmación del veterinario.'}
              {cita.asistencia === 'confirmada' && 'El cliente ha sido notificado.'}
            </p>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: FORMULARIO DE EDICIÓN --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Detalles de la Cita</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Estado Selector */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Estado de la Cita</label>
                <select
                  name="asistencia"
                  value={cita.asistencia}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
                >
                  <option value="no asistio">No asistió</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Fecha</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="date"
                    name="fechaProgramada"
                    value={cita.fechaProgramada}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Hora */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Hora</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="time"
                    name="hora"
                    value={cita.hora}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Veterinario */}
              {/* <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Veterinario Asignado</label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    name="vet_id"
                    value={cita.vet_id}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    {veterinarios.map((vet) => (
                      <option key={vet.uid} value={vet.uid}>
                        {`${vet.nombre} ${vet.apellidos}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div> */}

              {/* Motivo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Motivo de la Consulta</label>
                <input
                  type="text"
                  name="motivo"
                  value={cita.motivo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Notas / Observaciones */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Notas Internas / Observaciones</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 text-slate-400" size={18} />
                  <textarea
                    name="notas"
                    value={cita.notas || ''}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Escribe detalles importantes sobre el paciente o la cita..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActualizarCita;
