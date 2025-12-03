import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, Users, Mail, Phone, CheckCircle, Stethoscope } from 'lucide-react';

function VeterinariosPage() {
  const navigate = useNavigate();
  const [veterinarios, setVeterinarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getVeterinarios = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/usuarios?rol=veterinario`);
        setVeterinarios(data.data);
      } catch (error) {
        console.error('Error al cargar veterinarios:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getVeterinarios();
  }, []);

  const filteredVets = veterinarios.filter(
    (vet) =>
      vet.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvatarColor = (name) => {
    const colors = [
      'bg-emerald-100 text-emerald-600',
      'bg-violet-100 text-violet-600',
      'bg-blue-100 text-blue-600',
      'bg-amber-100 text-amber-600',
    ];
    return colors[name.length % colors.length];
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 pb-12">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Stethoscope className="text-blue-600" />
            Equipo Veterinario
          </h1>
          <p className="text-slate-500 text-sm ml-8">Gestiona el personal médico de la clínica.</p>
        </div>

        <button
          onClick={() => navigate('/usuarios/nuevo')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Nuevo Veterinario
        </button>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Total Veterinarios</p>
            <p className="text-2xl font-bold text-slate-800">{veterinarios.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Activos</p>
            <p className="text-2xl font-bold text-slate-800">{veterinarios.filter((v) => v.estado).length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Stethoscope size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Especialidades</p>
            <p className="text-2xl font-bold text-slate-800">{veterinarios.filter((v) => v.especialidad).length}</p>
          </div>
        </div>
      </div>

      {/* --- BARRA DE FILTROS --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
          />
        </div>
      </div>

      {/* --- TABLA --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p>Cargando personal...</p>
          </div>
        ) : filteredVets ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Veterinario</th>
                  <th className="px-6 py-4">Especialidad</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVets.map((vet) => (
                  <tr
                    key={vet.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                    onClick={() => navigate(`/usuarios/${vet.uid}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(
                            vet.nombre
                          )}`}
                        >
                          {vet.nombre[0]}
                          {vet.apellidos[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{vet.nombre}</p>
                          <span className="text-xs text-slate-400">ID: #{vet.uid}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                        <Stethoscope size={12} />
                        {vet.especialidad}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail size={14} className="text-slate-400" />
                          {vet.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone size={14} className="text-slate-400" />
                          {vet.telefono}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {vet.estado ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span> Inactivo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="bg-slate-50 p-4 rounded-full inline-block mb-3">
              <Stethoscope size={32} className="text-slate-300" />
            </div>
            <h3 className="text-slate-700 font-medium">No se encontraron veterinarios</h3>
            <p className="text-slate-400 text-sm mt-1">Intenta ajustar tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VeterinariosPage;
