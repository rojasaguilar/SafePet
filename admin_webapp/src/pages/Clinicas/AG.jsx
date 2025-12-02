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
  Navigation
} from 'lucide-react';

// --- COMPONENTE DE MAPA CON GOOGLE MAPS ---
const MapPicker = ({ onLocationSelect, lat, lng }) => {
  const mapRef = React.useRef(null);
  const [mapObj, setMapObj] = useState(null);
  const [markerObj, setMarkerObj] = useState(null);

  useEffect(() => {
    // Función de inicialización del mapa
    const initGoogleMap = () => {
      if (!mapRef.current) return;
      
      const defaultPos = { lat: 19.4326, lng: -99.1332 }; // CDMX por defecto
      const initialPos = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : defaultPos;

      if (window.google && window.google.maps) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: initialPos,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          });

          setMapObj(map);

          // Listener de clicks en el mapa
          map.addListener("click", (e) => {
            const clickedLat = e.latLng.lat();
            const clickedLng = e.latLng.lng();
            
            onLocationSelect({
                lat: clickedLat.toFixed(6),
                lng: clickedLng.toFixed(6)
            });
          });

          // Crear marcador inicial si existen coordenadas
          if (lat && lng) {
             const marker = new window.google.maps.Marker({
                position: initialPos,
                map: map,
                animation: window.google.maps.Animation.DROP
             });
             setMarkerObj(marker);
          }
      }
    };

    // Cargar script de Google Maps si no existe
    if (!window.google) {
      const script = document.createElement('script');
      // ¡IMPORTANTE! Reemplaza TU_API_KEY_AQUI con tu clave real
      // Para propósitos de demo, esto podría no cargar el mapa si no hay key, 
      // pero la estructura del componente es correcta.
      script.src = `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY_AQUI&callback=initMapPlaceholder`;
      script.async = true;
      script.defer = true;
      
      window.initMapPlaceholder = () => {
         initGoogleMap();
      };
      
      document.head.appendChild(script);
    } else {
      initGoogleMap();
    }
  }, []); 

  // Efecto para actualizar la posición del marcador si cambian las props
  useEffect(() => {
     if(mapObj && lat && lng && window.google) {
         const pos = { lat: parseFloat(lat), lng: parseFloat(lng) };
         
         if(markerObj) {
             markerObj.setPosition(pos);
         } else {
             const newMarker = new window.google.maps.Marker({
                 position: pos,
                 map: mapObj,
                 animation: window.google.maps.Animation.DROP
             });
             setMarkerObj(newMarker);
         }
         mapObj.panTo(pos); 
     }
  }, [lat, lng, mapObj, markerObj]);

  return (
    <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-200">
        <div ref={mapRef} className="w-full h-full" />
        {(!lat || !lng) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/5">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-slate-600 text-sm font-medium flex items-center gap-2">
                    <Navigation size={16} className="text-blue-500 animate-bounce" />
                    Haz clic en el mapa para fijar ubicación
                </div>
            </div>
        )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

function ClinicaPage() {
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
    encargado_id: '',
    horario: '',
    servicios: '',
    geLoc: { lat: '', lng: '' }
  });

  useEffect(() => {
    // Cargar lista de encargados (veterinarios/admins)
    const loadData = async () => {
      setIsLoading(true);
      try {
        // const { data } = await axios.get(...)
        await new Promise(resolve => setTimeout(resolve, 500));
        setEncargados([
          { id: 1, nombre: 'Dr. Roberto García' },
          { id: 2, nombre: 'Dra. Ana Martínez' },
          { id: 3, nombre: 'Admin. Carlos Ruiz' },
        ]);
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (loc) => {
    setFormData(prev => ({
      ...prev,
      geLoc: { lat: loc.lat, lng: loc.lng }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.geLoc.lat) {
        alert("Por favor selecciona una ubicación en el mapa.");
        setIsSubmitting(false);
        return;
    }

    try {
        // await axios.post(..., formData);
        console.log("Enviando datos:", formData);
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert("Clínica registrada exitosamente");
        navigate(-1);
    } catch (error) {
        alert("Error al registrar");
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
           <form id="clinica-form" onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
              
              {/* Sección 1: Datos Generales */}
              <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                      <Building2 size={16} /> Información General
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                      {/* Nombre */}
                      <div className="space-y-2">
                          <label className="block text-sm font-bold text-slate-700">Nombre de la Sucursal <span className="text-red-500">*</span></label>
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
                          <label className="block text-sm font-bold text-slate-700">Teléfono de Contacto <span className="text-red-500">*</span></label>
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
                          <label className="block text-sm font-bold text-slate-700">Encargado / Director <span className="text-red-500">*</span></label>
                          <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <select 
                                name="encargado_id"
                                value={formData.encargado_id}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                required
                              >
                                  <option value="">Seleccionar Encargado...</option>
                                  {encargados.map(e => (
                                      <option key={e.id} value={e.id}>{e.nombre}</option>
                                  ))}
                              </select>
                          </div>
                      </div>

                       {/* Horario */}
                       <div className="space-y-2">
                          <label className="block text-sm font-bold text-slate-700">Horario de Atención <span className="text-red-500">*</span></label>
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
                      <label className="block text-sm font-bold text-slate-700">Dirección Completa <span className="text-red-500">*</span></label>
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
                          <label className="block text-sm font-bold text-slate-700">Seleccionar en Mapa <span className="text-red-500">*</span></label>
                          <span className="text-xs text-slate-400 font-mono">
                              {formData.geLoc.lat ? `${formData.geLoc.lat}, ${formData.geLoc.lng}` : 'Sin ubicación'}
                          </span>
                      </div>
                      
                      <MapPicker 
                        onLocationSelect={handleLocationSelect} 
                        lat={formData.geLoc.lat} 
                        lng={formData.geLoc.lng} 
                      />
                      
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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${formData.nombre ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${formData.geLoc.lat ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Coordenadas</p>
                            {formData.geLoc.lat ? (
                                <p className="font-mono text-xs font-medium text-slate-700 mt-1">
                                    Lat: {formData.geLoc.lat}<br/>
                                    Lng: {formData.geLoc.lng}
                                </p>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No seleccionadas</p>
                            )}
                        </div>
                    </div>

                    {/* Preview Encargado */}
                    <div className="flex gap-4 items-start">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${formData.encargado_id ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                            <User size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Encargado</p>
                            <p className="font-bold text-slate-800">
                                {encargados.find(e => e.id.toString() === formData.encargado_id)?.nombre || 'No asignado'}
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
export default  ClinicaPage