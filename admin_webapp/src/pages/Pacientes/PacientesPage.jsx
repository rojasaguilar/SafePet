import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Dog, Cat, MoreVertical, FileText, Calendar, Weight } from 'lucide-react';

function PacientesPage() {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [mascotas, setMascotas] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null);

  // Estados para filtros (Listos para tu lógica)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos'); // 'todos', 'Perro', 'Gato', etc.

  // --- LÓGICA DE DATOS ---
  useEffect(() => {
    const getMascotas = async () => {
      try {
        setIsLoading(true);
        // Recuperar usuario de sessionStorage con manejo seguro
        const storedUser = sessionStorage.getItem('loggedUser');
        if (!storedUser) {
          // Manejar caso no logueado (ej. redirigir login)
          console.warn('No hay usuario logueado');
          setIsLoading(false);
          return;
        }

        const loggedUser = JSON.parse(storedUser);

        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/mascotas`, {
          headers: {
            'Content-Type': 'application/json',
            app: 'admin-webapp',
            Authorization: `Bearer ${loggedUser.idToken}`,
          },
        });

        setMascotas(data.data || []); // Asegurar que sea array
      } catch (err) {
        console.error('Error al cargar mascotas:', err);
        setError('No se pudieron cargar los pacientes.');
      } finally {
        setIsLoading(false);
      }
    };

    getMascotas();
  }, []);

  // --- LÓGICA DE FILTRADO (Cliente) ---
  // Filtra las mascotas basándose en el buscador y el tipo seleccionado
  const filteredMascotas = mascotas.filter((mascota) => {
    const matchesSearch =
      mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mascota.nombre_dueno.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'todos' || mascota.tipo === filterType;

    return matchesSearch && matchesType;
  });

  // --- NAVEGACIÓN ---
  const goToDetail = (id) => {
    navigate(`/pacientes/${id}`, {
      state: { mascotaId: id },
    });
  };

  const handleAddMascota = () => {
    // Aquí puedes navegar a un formulario o abrir un modal
    navigate('/pacientes/nuevo');
    console.log('Navegando a crear nueva mascota...');
  };

  // --- UTILS VISUALES ---
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-purple-100 text-purple-600',
      'bg-green-100 text-green-600',
      'bg-orange-100 text-orange-600',
    ];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  };

  const getTypeIcon = (tipo) => {
    if (tipo?.toLowerCase() === 'perro') return <Dog size={16} />;
    if (tipo?.toLowerCase() === 'gato') return <Cat size={16} />;
    return <FileText size={16} />;
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
          <p className="text-slate-500 text-sm">Administra el historial y datos de las mascotas.</p>
        </div>

        <button
          onClick={handleAddMascota}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Nueva Mascota
        </button>
      </div>

      {/* --- BARRA DE FILTROS --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Buscador */}
        <div className="relative w-full md:w-96 group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o dueño..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
          />
        </div>

        {/* Filtros Dropdown */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm focus:outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-50"
            >
              <option value="todos">Todos los tipos</option>
              <option value="Perro">Perros</option>
              <option value="Gato">Gatos</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- TABLA DE DATOS --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          // Skeleton Loading State
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
                <div className="flex-1 space-y-2 py-2">
                  <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error State
          <div className="p-12 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : filteredMascotas.length > 0 ? (
          // Tabla Real
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Paciente</th>
                  <th className="px-6 py-4">Raza / Tipo</th>
                  <th className="px-6 py-4 text-center">Sexo</th>
                  <th className="px-6 py-4 text-center">Peso</th>
                  <th className="px-6 py-4">Dueño</th>
                  <th className="px-6 py-4">Veterinario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMascotas.map((mascota) => (
                  <tr
                    key={mascota.id}
                    onClick={() => goToDetail(mascota.id)}
                    className="group hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    {/* Paciente */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(
                            mascota.nombre
                          )}`}
                        >
                          {mascota.nombre ? mascota.nombre.substring(0, 2).toUpperCase() : 'NA'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                            {mascota.nombre}
                          </p>
                          <span className="text-xs text-slate-400">ID: #{mascota.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Raza / Tipo */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        {getTypeIcon(mascota.tipo)}
                        <span className="text-sm">{mascota.raza || 'Mestizo'}</span>
                      </div>
                    </td>

                    {/* Sexo */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          mascota.sexo === 'Macho' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}
                      >
                        {mascota.sexo}
                      </span>
                    </td>

                    {/* Peso */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-600 text-sm">
                        <Weight size={14} className="text-slate-400" />
                        {mascota.peso}
                      </div>
                    </td>

                    {/* Dueño */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 font-medium">{mascota.nombre_dueno}</p>
                      <p className="text-xs text-slate-400">Propietario</p>
                    </td>

                    {/* Veterinario */}
                    <td className="px-6 py-4">
                      {mascota.vet_nombre ? (
                        <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                          Dr. {mascota.vet_nombre}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Sin asignar</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Empty State (Sin resultados)
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No se encontraron mascotas</h3>
            <p className="text-slate-500 max-w-sm mt-1">
              {searchTerm
                ? `No hay resultados para "${searchTerm}". Intenta con otro término.`
                : 'Aún no has registrado ninguna mascota en el sistema.'}
            </p>
            {!searchTerm && (
              <button onClick={handleAddMascota} className="mt-6 text-blue-600 font-medium hover:underline">
                Registrar la primera mascota
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PacientesPage;
