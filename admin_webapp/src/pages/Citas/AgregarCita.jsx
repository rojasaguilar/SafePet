import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  PawPrint,
  Save,
  MessageSquare,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// --- COMPONENTE PRINCIPAL ---

function AgregarCita() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

  // Datos para los selectores (Mocks)
  const [pacientes, setPacientes] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [clinicas, setClinicas] = useState([]);

  // Estado del Formulario
  const [formData, setFormData] = useState({
    mascota_id: '',
    vet_id: '',
    fechaProgramada: '',
    fecha: "",
    hora: '',
    motivo: '',
    notas: '',
  });

  console.log(formData);

  // Efecto para cargar datos iniciales (Pacientes y Veterinarios)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        fetchVets();
        fetchMascotas();
        fetchClinicas();
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchVets = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/usuarios?rol=veterinario`, {
      headers: {
        app: 'admin-webapp',
        Authorization: `Bearer ${loggedUser.idToken}`,
      },
    });
    setVeterinarios(data.data);
  };

  const fetchClinicas = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/clinicas`, {
      headers: {
        app: 'admin-webapp',
        Authorization: `Bearer ${loggedUser.idToken}`,
      },
    });
    setClinicas(data.data);
  };

  const fetchMascotas = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/mascotas`, {
      headers: {
        app: 'admin-webapp',
        Authorization: `Bearer ${loggedUser.idToken}`,
      },
    });
    setPacientes(data.data);
  };

  console.log(pacientes);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación básica
    if (!formData.mascota_id || !formData.fecha || !formData.hora || !formData.motivo) {
      alert('Por favor completa los campos obligatorios');
      setIsSubmitting(false);
      return;
    }
    const fechaCompleta = new Date(`${formData.fecha}T${formData.hora}`);
    console.log(fechaCompleta);

    formData.fechaProgramada = fechaCompleta;

    try {
      // --- LÓGICA DE GUARDADO ---
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL_BASE}/citas`, formData);

      if (response.status === 201) {
        alert(response.data.mensaje);
        navigate('/citas');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Ocurrió un error al agendar la cita.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helpers para visualización en el resumen
  const selectedMascota = pacientes.find((p) => p.id === formData.mascota_id);
  const selectedVet = veterinarios.find((v) => v.uid === formData.vet_id);

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
          <h1 className="text-xl font-bold text-slate-800">Nueva Cita</h1>
          <p className="text-xs text-slate-400">Agendar consulta para un paciente</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUMNA IZQUIERDA: FORMULARIO --- */}
        <div className="lg:col-span-2 space-y-6">
          <form
            id="cita-form"
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8"
          >
            {/* Sección 1: Quién */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                Detalles del Paciente y Especialista
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Selector Paciente */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Paciente <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <PawPrint className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      name="mascota_id"
                      value={formData.mascota_id}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer text-slate-700"
                      required
                    >
                      <option value="">Seleccionar Mascota...</option>
                      {pacientes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} ({p.raza}) - Dueño: {p.nombre_dueno}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selector Veterinario */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Veterinario</label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      name="vet_id"
                      value={formData.vet_id}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer text-slate-700"
                    >
                      <option value="">Selecciona veterinario</option>
                      {veterinarios.map((v) => (
                        <option key={v.id} value={v.uid}>
                          {v.nombre} {v.apellidos} - {v.especialidad}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selector Clinicas */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Clinica <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <PawPrint className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      name="clinica_id"
                      value={formData.clinica_id}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer text-slate-700"
                      required
                    >
                      <option value="">Seleccionar Clinica...</option>
                      {clinicas.map((c) => (
                        <option key={c.clinica_id} value={c.clinica_id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Cuándo */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                Fecha y Hora
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Fecha */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                      required
                    />
                  </div>
                </div>

                {/* Hora */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Hora <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="time"
                      name="hora"
                      value={formData.hora}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 3: Por qué */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                Detalles de la Consulta
              </h3>

              {/* Motivo */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Motivo de la visita <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  placeholder="Ej. Vacunación, Revisión general, Urgencia..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Notas Adicionales (Opcional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 text-slate-400" size={18} />
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Instrucciones especiales, síntomas previos, etc."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* --- COLUMNA DERECHA: RESUMEN Y ACCIONES --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tarjeta de Resumen en Tiempo Real */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-blue-600" size={20} />
              Resumen
            </h2>

            <div className="space-y-6">
              {/* Resumen Paciente */}
              <div className="flex gap-4 items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selectedMascota ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <PawPrint size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Paciente</p>
                  {selectedMascota ? (
                    <>
                      <p className="font-bold text-slate-800">{selectedMascota.nombre}</p>
                      <p className="text-xs text-slate-500">{selectedMascota.raza}</p>
                    </>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No seleccionado</p>
                  )}
                </div>
              </div>

              {/* Resumen Veterinario */}
              <div className="flex gap-4 items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selectedVet ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Stethoscope size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Especialista</p>
                  {selectedVet ? (
                    <p className="font-bold text-slate-800">{selectedVet.nombre}</p>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Cualquier disponible</p>
                  )}
                </div>
              </div>

              {/* Resumen Fecha */}
              <div className="flex gap-4 items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    formData.fecha && formData.hora
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Horario</p>
                  {formData.fecha && formData.hora ? (
                    <p className="font-bold text-slate-800">
                      {formData.fecha} a las {formData.hora}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Definir fecha y hora</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                form="cita-form"
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Agendando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Confirmar Cita
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full mt-3 py-3 text-slate-500 font-medium hover:text-slate-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Aviso */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-blue-800 text-sm">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p>Recuerda que al confirmar, se enviará una notificación automática al correo del propietario.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper para previsualización
export default AgregarCita;
