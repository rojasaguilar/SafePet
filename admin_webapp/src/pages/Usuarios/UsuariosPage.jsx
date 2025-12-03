
import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Plus,
  Users,
  UserCog,
  User,
  Stethoscope,
  MoreVertical,
  Shield,
  Mail,
  Phone,
  Filter,
} from 'lucide-react';

function UsuariosPage() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos'); // 'todos', 'admin', 'veterinario', 'cliente'

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/usuarios`);
        setUsuarios(data.data);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // --- LÓGICA DE FILTRADO ---
  const filteredUsers = usuarios.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'todos' || user.rol === roleFilter;

    return matchesSearch && matchesRole;
  });

  // --- UTILS VISUALES ---
  const getRoleBadge = (rol) => {
    switch (rol) {
      case 'administrador':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">
            <Shield size={12} /> Administrador
          </span>
        );
      case 'veterinario':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">
            <Stethoscope size={12} /> Veterinario
          </span>
        );
      case 'usuario':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
            <User size={12} /> Usuario
          </span>
        );
      default:
        return <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">{rol}</span>;
    }
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600',
      'bg-teal-100 text-teal-600',
      'bg-orange-100 text-orange-600',
    ];
    return colors[name.length % colors.length];
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 pb-12">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-blue-600" />
            Gestión de Usuarios
          </h1>
          <p className="text-slate-500 text-sm ml-8">Administra accesos, clientes y personal.</p>
        </div>

        <button
          onClick={() => navigate('/usuarios/nuevo')}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Usuarios', val: usuarios.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          {
            label: 'Clientes',
            val: usuarios.filter((u) => u.rol === 'usuario').length,
            icon: User,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Veterinarios',
            val: usuarios.filter((u) => u.rol === 'veterinario').length,
            icon: Stethoscope,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Admins',
            val: usuarios.filter((u) => u.rol === 'administrador').length,
            icon: Shield,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
          },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-slate-800">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- BARRA DE HERRAMIENTAS --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Buscador */}
        <div className="relative w-full md:w-96 group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
          />
        </div>

        {/* Filtro Rol */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['todos', 'usuario', 'veterinario', 'administrador'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ${
                roleFilter === role
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* --- TABLA --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 space-y-4">
            <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group" onClick={() => navigate(`/usuarios/${user.uid}`)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(
                            user.nombre
                          )}`}
                        >
                          {user.nombre.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{user.nombre}</p>
                          <span className="text-xs text-slate-400">ID: #{user.uid}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.rol)}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail size={14} className="text-slate-400" />
                          {user.email}
                        </div>
                        {user.telefono && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={14} className="text-slate-400" />
                            {user.telefono}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.estado ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span> Inactivo
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
              <UserCog size={32} className="text-slate-300" />
            </div>
            <h3 className="text-slate-700 font-medium">No se encontraron usuarios</h3>
            <p className="text-slate-400 text-sm mt-1">Intenta con otros filtros de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsuariosPage;
