import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import {
  Users,
  Calendar,
  PawPrint,
  Building2,
  TrendingUp,
  Activity,
  Plus,
  ArrowRight,
  AlertCircle,
  MoreHorizontal,
  DollarSign,
} from 'lucide-react';

import axios from 'axios';

import UpcomingAppointments from '../components/DashboardAdmin/UpcomingAppointments.jsx';

// --- COMPONENTES UI INTERNOS ---

const StatCard = ({ title, value, trend, icon: Icon, color, trendColor }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trendColor}`}>
          <TrendingUp size={12} className="mr-1" /> {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  </div>
);

// Gráfico de Barras Simple (CSS puro para evitar librerías pesadas)
const ActivityChart = () => {
  const data = [
    { day: 'Lun', value: 65 },
    { day: 'Mar', value: 45 },
    { day: 'Mié', value: 80 },
    { day: 'Jue', value: 55 },
    { day: 'Vie', value: 90 },
    { day: 'Sáb', value: 70 },
    { day: 'Dom', value: 30 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Actividad Semanal</h3>
        <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-1 focus:outline-none">
          <option>Esta Semana</option>
          <option>Semana Pasada</option>
        </select>
      </div>

      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
            <div className="relative w-full flex justify-center">
              {/* Tooltip simulado */}
              <span className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value} citas
              </span>
              {/* Barra */}
              <div
                className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 hover:opacity-80 ${
                  idx === 4 ? 'bg-blue-600' : 'bg-blue-200'
                }`}
                style={{ height: `${item.value * 2}px` }}
              ></div>
            </div>
            <span className="text-xs font-medium text-slate-400">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DEL DASHBOARD ---

function DashboardAdmin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

  // Estados para datos
  const [stats, setStats] = useState({});
  const [recentCitas, setRecentCitas] = useState([]);
  const [newPatients, setNewPatients] = useState([]);

  const fetchCitasRecientes = async () => {
    // setIsLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/citas?sort=fechaProgramada`);
      setRecentCitas(data.data);
    } catch (error) {
      console.error('Error cargando cita:', error);
    }
  };

  const fetchUsuarios = async () => {
    // setIsLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/usuarios?rol=usuario`);
      setStats((prev) => ({ ...prev, usuarios: data.data.length }));
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const fetchPacientes = async () => {
    // setIsLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/mascotas`, {
        headers: {
          'Content-Type': 'application/json',
          app: 'admin-webapp',
          Authorization: `Bearer ${loggedUser.idToken}`,
        },
      });
      setStats((prev) => ({ ...prev, pacientes: data.data.length }));
    } catch (error) {
      console.error('Error cargando pacientes:', error);
    }
  };

  const fetchStats = async () => {
    await Promise.all([fetchUsuarios(), fetchPacientes()]);
  };

  useEffect(() => {
    // Simular carga de datos

    const loadDashboardData = async () => {
      setIsLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 800));
      try {
        await fetchCitasRecientes();
        // setStats({
        //   usuarios: 1250,
        //   citasHoy: recentCitas.length,
        //   pacientes: 890,
        //   ingresos: '$45,200',
        // });

        await fetchStats();

        setNewPatients([
          { id: 1, nombre: 'Thor', raza: 'Husky', tipo: 'Perro', time: 'Hace 2h' },
          { id: 2, nombre: 'Mishi', raza: 'Persa', tipo: 'Gato', time: 'Hace 5h' },
          { id: 3, nombre: 'Nemo', raza: 'Pez Payaso', tipo: 'Pez', time: 'Ayer' },
        ]);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);
  console.log(recentCitas);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Panel de Control</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Activity size={12} className="text-green-500" /> Sistema operativo y en línea
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-slate-800 transition-colors">
            AD
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* <StatCard
            title="Citas Hoy"
            value={stats.citasHoy}
            trend="+12%"
            icon={Calendar}
            color="bg-blue-50 text-blue-600"
            trendColor="bg-green-100 text-green-700"
          /> */}
          <StatCard
            title="Total Pacientes"
            value={stats.pacientes}
            trend="+5%"
            icon={PawPrint}
            color="bg-orange-50 text-orange-600"
            trendColor="bg-green-100 text-green-700"
          />
          <StatCard
            title="Clientes Registrados"
            value={stats.usuarios}
            trend="+8%"
            icon={Users}
            color="bg-purple-50 text-purple-600"
            trendColor="bg-green-100 text-green-700"
          />
          {/* <StatCard
            title="Ingresos (Mes)"
            value={stats.ingresos}
            trend="+24%"
            icon={DollarSign}
            color="bg-emerald-50 text-emerald-600"
            trendColor="bg-emerald-100 text-emerald-700"
          /> */}
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMNA IZQUIERDA (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gráfico */}
            {/* <ActivityChart /> */}

            {/* Tabla Citas Recientes */}
            <UpcomingAppointments citas={recentCitas} />
          </div>

          {/* COLUMNA DERECHA (1/3) */}
          <div className="space-y-8">
            {/* Accesos Rápidos */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg shadow-slate-900/20">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Activity size={20} className="text-blue-400" /> Accesos Rápidos
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/citas/nueva')}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all group"
                >
                  <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Plus size={18} />
                  </div>
                  <span className="text-xs font-medium">Nueva Cita</span>
                </button>
                <button
                  onClick={() => navigate('/pacientes')}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all group"
                >
                  <div className="p-2 bg-orange-500 rounded-lg group-hover:scale-110 transition-transform">
                    <PawPrint size={18} />
                  </div>
                  <span className="text-xs font-medium">Pacientes</span>
                </button>
                <button
                  onClick={() => navigate('/usuarios')}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all group"
                >
                  <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Users size={18} />
                  </div>
                  <span className="text-xs font-medium">Usuarios</span>
                </button>
                <button
                  onClick={() => navigate('/clinicas')}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all group"
                >
                  <div className="p-2 bg-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Building2 size={18} />
                  </div>
                  <span className="text-xs font-medium">Clínicas</span>
                </button>
              </div>
            </div>

            {/* Nuevos Pacientes
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Nuevos Pacientes</h3>
                <MoreHorizontal className="text-slate-400 cursor-pointer hover:text-slate-600" />
              </div>
              <div className="space-y-4">
                {newPatients.map((paciente) => (
                  <div key={paciente.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                      {paciente.nombre[0]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm">{paciente.nombre}</h4>
                      <p className="text-xs text-slate-500">
                        {paciente.raza} • {paciente.tipo}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-slate-400">{paciente.time}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-sm text-slate-500 font-medium hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                Ver todos los pacientes <ArrowRight size={14} />
              </button>
            </div> */}

            {/* Alerta de Sistema (Ejemplo)
            <div className="bg-red-50 rounded-2xl border border-red-100 p-4 flex gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-red-800 text-sm">Mantenimiento Programado</h4>
                <p className="text-xs text-red-600 mt-1 leading-relaxed">
                  El sistema se actualizará este Domingo a las 02:00 AM. Podría haber intermitencias.
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper para previsualización
export default DashboardAdmin;
