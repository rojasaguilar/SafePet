import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Plus,
  Search,
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  Users,
  Stethoscope,
  Filter,
} from 'lucide-react';

// --- COMPONENTE PRINCIPAL ---

function ClinicasPage() {
  const navigate = useNavigate();
  const [clinicas, setClinicas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Efecto de Carga
  useEffect(() => {
    const fetchClinicas = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/clinicas`);
        setClinicas(data.data);
      } catch (error) {
        console.error('Error cargando clínicas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClinicas();
  }, []);

  // Filtrado
  const filteredClinicas = clinicas.filter(
    (clinica) =>
      clinica.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinica.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Utils Visuales
  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'activo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Activo
          </span>
        );
      case 'inactivo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Inactiva
          </span>
        );
      case 'mantenimiento':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
            <AlertTriangle size={10} /> Mantenimiento
          </span>
        );
    }
  };

  console.log(clinicas);

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 pb-12">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="text-blue-600" />
            Clínicas y Sucursales
          </h1>
          <p className="text-slate-500 text-sm ml-9">Administra las ubicaciones físicas y sus recursos.</p>
        </div>

        <button
          onClick={() => navigate('/clinicas/nueva')}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Registrar Clínica
        </button>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Total Sucursales</p>
            <p className="text-2xl font-bold text-slate-800">{clinicas.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Operando</p>
            <p className="text-2xl font-bold text-slate-800">{clinicas.filter((c) => c.estado === 'activo').length}</p>
          </div>
        </div>
        {/* ESPACIO DISPONIBLE */}
        {/* <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <Stethoscope size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Personal Total</p>
            <p className="text-2xl font-bold text-slate-800">
              {clinicas.reduce((acc, curr) => acc + (curr.veterinarios || 0), 0)}
            </p>
          </div>
        </div> */}
      </div>

      {/* --- BARRA DE HERRAMIENTAS --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar clínica por nombre o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
          />
        </div>

        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors hidden sm:block">
          <Filter size={20} />
        </button>
      </div>

      {/* --- LISTADO DE CLÍNICAS (Layout Híbrido: Tarjetas amplias) --- */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-2"></div>
            <p>Cargando sucursales...</p>
          </div>
        ) : filteredClinicas.length > 0 ? (
          filteredClinicas.map((clinica) => (
            <div
              key={clinica.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col md:flex-row gap-6 items-start md:items-center"
              onClick={() => navigate(`/clinicas/${clinica.clinica_id}`)}
            >
              {/* Icono / Imagen */}
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                <Building2 size={32} />
              </div>

              {/* Info Principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-slate-800 truncate">{clinica.nombre}</h3>
                  {getStatusBadge(clinica.estado)}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-500 mt-2 items-start">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {clinica.direccion}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} /> {clinica.telefono}
                  </span>
                </div>
              </div>

              {/* Info Secundaria (Veterinarios, Horario) */}
              <div className="flex flex-wrap gap-6 md:border-l md:border-slate-100 md:pl-6">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                    <Clock size={12} /> Horario
                  </p>
                  <p className="text-sm font-medium text-slate-700">{clinica.horario}</p>
                </div>
                {/* <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                    <Users size={12} /> Personal
                  </p>
                  <p className="text-sm font-medium text-slate-700">{clinica.veterinarios} Veterinarios</p>
                </div> */}
                <div className="hidden lg:block">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Encargado</p>
                  <p className="text-sm font-medium text-slate-700">{clinica.encargado}</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 md:ml-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="bg-slate-50 p-4 rounded-full inline-block mb-3">
              <Building2 size={32} className="text-slate-300" />
            </div>
            <h3 className="text-slate-700 font-medium">No se encontraron clínicas</h3>
            <p className="text-slate-400 text-sm mt-1">Intenta ajustar tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapper para previsualización
export default ClinicasPage;
