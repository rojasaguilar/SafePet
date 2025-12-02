import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import axios from 'axios'; // Descomentar para producción
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Clock,
  User,
  Stethoscope,
  Save,
  LayoutGrid,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

// --- COMPONENTE DE MAPA INTERACTIVO (SIMULADO) ---
const MapPicker = ({ onLocationSelect, selectedLocation }) => {
  const handleMapClick = (e) => {
    // Obtenemos las dimensiones del contenedor
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculamos porcentajes para posicionar el pin visualmente
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Simulamos coordenadas reales basadas en el click (Base: CDMX)
    // En una implementación real, aquí usarías Leaflet o Google Maps API
    const lat = 19.4326 + (0.5 - y / rect.height) * 0.1;
    const lng = -99.1332 + (x / rect.width - 0.5) * 0.1;

    onLocationSelect({
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
      x: xPercent,
      y: yPercent,
    });
  };

  console.log();

  return (
    <div
      className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-200 cursor-crosshair group hover:border-blue-400 transition-colors"
      onClick={handleMapClick}
    >
      {/* Imagen de fondo de mapa (Placeholder) */}
      <img
        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        alt="Mapa"
        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale hover:grayscale-0"
      />

      {/* Instrucción Overlay */}
      {!selectedLocation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-slate-600 text-sm font-medium flex items-center gap-2">
            <Navigation size={16} className="text-blue-500 animate-bounce" />
            Haz clic para seleccionar ubicación
          </div>
        </div>
      )}

      {/* Pin Marcador */}
      {selectedLocation && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 ease-out"
          style={{ left: `${selectedLocation.x}%`, top: `${selectedLocation.y}%` }}
        >
          <MapPin size={40} className="text-red-500 fill-red-500 drop-shadow-lg" />
        </div>
      )}
    </div>
  );
};

const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
// --- COMPONENTE PRINCIPAL ---

function AgregarClinica() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mocks de datos
  const [encargados, setEncargados] = useState([]);

  // Estado del Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    encargado: '',
    horario: '',
    servicios: '',
    geLoc: { lat: '', lng: '' },
  });

  // Estado visual del pin en el mapa (x, y porcentaje)
  const [mapPin, setMapPin] = useState(null);

  useEffect(() => {
    // Cargar lista de encargados (veterinarios/admins)
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/usuarios?rol=veterinario`);
        setEncargados(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  console.log(formData);

  const handleLocationSelect = (loc) => {
    setMapPin({ x: loc.x, y: loc.y });
    setFormData((prev) => ({
      ...prev,
      geLoc: { lat: loc.lat, lng: loc.lng },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.geLoc.lat) {
      alert('Por favor selecciona una ubicación en el mapa.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL_BASE}/clinicas`, formData, {
        headers: {
          'Content-Type': 'application/json',
          app: 'admin-webapp',
          Authorization: `Bearer ${loggedUser.idToken}`,
        },
      });

      // alert('Clínica registrada exitosamente');
      // navigate(-1);
    } catch (error) {
      console.log(error);
      alert('Error al registrar');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-xl font-bold text-slate-800">Registrar Clínica</h1>
          <p className="text-xs text-slate-400">Añadir nueva sucursal al sistema</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUMNA IZQUIERDA: FORMULARIO --- */}
        <div className="lg:col-span-2 space-y-6">
          <form
            id="clinica-form"
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8"
          >
            {/* Sección 1: Datos Generales */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <Building2 size={16} /> Información General
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Nombre de la Sucursal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Sucursal Centro"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Telefono */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Teléfono de Contacto <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="55-1234-5678"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Encargado */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Encargado / Director <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      name="encargado"
                      value={formData.encargado}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Seleccionar Encargado...</option>
                      {encargados.map((e) => (
                        <option key={e.uid} value={e.uid}>
                          {`${e.nombre} ${e.apellidos}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Horario */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Horario de Atención <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="horario"
                      value={formData.horario}
                      onChange={handleChange}
                      placeholder="Ej. Lunes a Viernes 9am - 6pm"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Ubicación */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <MapPin size={16} /> Ubicación Geográfica
              </h3>

              {/* Dirección Textual */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Dirección Completa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Calle, Número, Colonia, Ciudad"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* Mapa Picker */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-slate-700">
                    Seleccionar en Mapa <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400 font-mono">
                    {formData.geLoc.lat ? `${formData.geLoc.lat}, ${formData.geLoc.lng}` : 'Sin ubicación'}
                  </span>
                </div>

                <MapPicker onLocationSelect={handleLocationSelect} selectedLocation={mapPin} />

                {/* Inputs Ocultos para el Formulario real */}
                <input type="hidden" name="lat" value={formData.geLoc.lat} />
                <input type="hidden" name="lng" value={formData.geLoc.lng} />
              </div>
            </div>

            {/* Sección 3: Servicios */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <LayoutGrid size={16} /> Servicios Disponibles
              </h3>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Descripción de Servicios</label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-4 text-slate-400" size={18} />
                  <textarea
                    name="servicios"
                    value={formData.servicios}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Ej. Consulta general, Rayos X, Cirugía, Hospitalización..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  ></textarea>
                </div>
                <p className="text-xs text-slate-400">Separa los servicios principales con comas.</p>
              </div>
            </div>
          </form>
        </div>

        {/* --- COLUMNA DERECHA: RESUMEN Y ACCIONES --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-blue-600" size={20} />
              Resumen
            </h2>

            <div className="space-y-6">
              {/* Preview Nombre */}
              <div className="flex gap-4 items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    formData.nombre ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Building2 size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Clínica</p>
                  <p className="font-bold text-slate-800">{formData.nombre || 'Sin nombre'}</p>
                  <p className="text-xs text-slate-500">{formData.horario || '--:--'}</p>
                </div>
              </div>

              {/* Preview Ubicación */}
              <div className="flex gap-4 items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    formData.geLoc.lat ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Coordenadas</p>
                  {formData.geLoc.lat ? (
                    <p className="font-mono text-xs font-medium text-slate-700 mt-1">
                      Lat: {formData.geLoc.lat}
                      <br />
                      Lng: {formData.geLoc.lng}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No seleccionadas</p>
                  )}
                </div>
              </div>

              {/* Preview Encargado */}
              <div className="flex gap-4 items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    formData.encargado ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Encargado</p>
                  <p className="font-bold text-slate-800">
                    {encargados.find((e) => e.uid === formData.encargado)?.nombre || 'No asignado'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                form="clinica-form"
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Registrando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Guardar Clínica
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper para previsualización
export default AgregarClinica;
