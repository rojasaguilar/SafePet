import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Clock,
  User,
  Stethoscope,
  Edit,
  CheckCircle,
  AlertTriangle,
  Navigation,
  BadgeCheck,
  Ban,
} from 'lucide-react';

// --- COMPONENTE DE MAPA (SOLO LECTURA) ---
const MapViewer = ({ lat, lng }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !window.google || !lat || !lng) return;

    const pos = { lat: parseFloat(lat), lng: parseFloat(lng) };

    const map = new window.google.maps.Map(mapRef.current, {
      center: pos,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      draggable: false, // Mapa estático
      zoomControl: true,
    });

    new window.google.maps.Marker({
      position: pos,
      map: map,
      animation: window.google.maps.Animation.DROP,
    });
  }, [lat, lng]);

  if (!lat || !lng)
    return (
      <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
        <div className="text-center">
          <MapPin size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Ubicación no disponible</p>
        </div>
      </div>
    );

  return (
    <div className="w-full h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative group">
      <div ref={mapRef} className="w-full h-full" />
      {/* Botón para abrir en Google Maps externo */}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-lg shadow-md text-xs font-bold text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Navigation size={12} /> Ver en Maps
      </a>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

function ClinicaPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [clinica, setClinica] = useState(null);

  const capitalize = (str) => {
    if (!str) return '';
    const splitted = str.split(' ');
    if (splitted.length > 1) return splitted.map((str) => `${str.charAt(0).toUpperCase() + str.slice(1)} `);
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchClinica = async () => {
      setIsLoading(true);
      try {
        // --- CÓDIGO REAL ---
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/clinicas/${id}`);
        setClinica(data.data);
      } catch (error) {
        console.error('Error cargando clínica:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinica();
  }, [id]);

  console.log(clinica);

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de desactivar esta sucursal del sistema?')) {
      // Lógica de borrado
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL_BASE}/clinicas/${id}`);

      if (response.status === 200) {
        alert('Sucursal desactivada');
        navigate('/clinicas');
      }
    }
  };
  const handleActivate = async () => {
    if (confirm('¿Volver a activar esta sucursal del sistema?')) {
      // Lógica de borrado
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL_BASE}/clinicas/${id}`, {
        estado: 'activo',
      });

      if (response.status === 200) {
        alert('Sucursal activa');
        navigate('/clinicas');
      }
    }
  };

  const getStatusBadge = (estado) => {
    if (estado === 'abierto') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold border border-green-200">
          <CheckCircle size={14} /> Operando
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-bold border border-amber-200">
        <AlertTriangle size={14} /> Mantenimiento
      </span>
    );
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (!clinica) return <div className="p-8 text-center">Clínica no encontrada</div>;

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
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="text-blue-600" />
              {clinica.nombre}
            </h1>
            <p className="text-xs text-slate-400">ID Sucursal: #{clinica.clinica_id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {clinica.estado === 'inactivo' ? (
            <button
              onClick={handleActivate}
              className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100 flex flex-col items-center"
              title="Eliminar Sucursal"
            >
              <BadgeCheck size={20} />
              Activar
            </button>
          ) : (
            <button
              onClick={handleDelete}
              className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100 flex flex-col items-center"
              title="Eliminar Sucursal"
            >
              <Ban size={20} />
              Desactivar
            </button>
          )}
          <button
            onClick={() => navigate(`/clinicas/editar/${id}`)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all active:scale-95"
          >
            <Edit size={18} />
            Editar Datos
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUMNA IZQUIERDA: RESUMEN Y MAPA --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tarjeta Principal */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>

            <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-md flex items-center justify-center text-blue-600 mb-4">
              <Building2 size={40} />
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-2">{clinica.nombre}</h2>
            <div className="flex justify-center mb-6">{getStatusBadge(clinica.estado)}</div>

            <div className="text-left space-y-4 pt-4 border-t border-slate-50">
              <div className="flex items-start gap-3">
                <User className="text-slate-400 mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Encargado</p>
                  <p className="font-medium text-slate-700">{capitalize(clinica.encargado_nombre)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa de Ubicación */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin size={16} /> Ubicación
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {clinica.geoLoc.lat}, {clinica.geoLoc.lng}
              </span>
            </div>
            <MapViewer lat={clinica.geoLoc.lat} lng={clinica.geoLoc.lng} />
            <p className="text-sm text-slate-600 mt-3 px-2">{clinica.direccion}</p>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: DETALLES OPERATIVOS --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-50">
              Información Operativa
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Horarios */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={14} /> Horario de Atención
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium">
                  {clinica.horario}
                </div>
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Phone size={14} /> Contacto
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium flex items-center justify-between">
                  {clinica.telefono}
                  <a
                    href={`tel:${clinica.telefono}`}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Phone size={16} />
                  </a>
                </div>
              </div>

              {/* Servicios */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Stethoscope size={14} /> Servicios Disponibles
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {clinica.servicios.map((servicio, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100"
                    >
                      {servicio.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClinicaPage;
