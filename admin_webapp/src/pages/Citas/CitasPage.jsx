import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  User,
  Stethoscope,
  PawPrint,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  ChevronDown,
  CalendarDays,
  Plus,
} from 'lucide-react';

// --- COMPONENTE PRINCIPAL ---

function CitasPage() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  
  const [searchTerm, setSearchTerm] = useState(''); // Busca por Cliente o Mascota
  const [filterType, setFilterType] = useState('todos'); // Tipo de Mascota
  const [filterVet, setFilterVet] = useState('todos'); // Veterinario ID o Nombre
  const [filterDate, setFilterDate] = useState(''); // Fecha específica
  // const [sortOrder, setSortOrder] = useState('-'); // 'asc' | 'desc' (por fecha/hora)

 
  useEffect(() => {
    const fetchCitas = async () => {
      setIsLoading(true);
      try {
      

        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/citas?sort=fechaProgramada`);
        setCitas(data.data);

        
        // setCitas([
        //   {
        //     id: 1,
        //     fecha: '2023-10-25',
        //     hora: '09:00',
        //     mascota: { nombre: 'Max', tipo: 'Perro', raza: 'Golden' },
        //     cliente: { nombre: 'Juan Pérez' },
        //     veterinario: { nombre: 'Dr. Roberto García' },
        //     motivo: 'Vacunación Anual',
        //     estado: 'pendiente',
        //   },
        //   {
        //     id: 2,
        //     fecha: '2023-10-25',
        //     hora: '10:30',
        //     mascota: { nombre: 'Luna', tipo: 'Gato', raza: 'Siames' },
        //     cliente: { nombre: 'Maria Lopez' },
        //     veterinario: { nombre: 'Dra. Ana Martínez' },
        //     motivo: 'Revisión General',
        //     estado: 'completada',
        //   },
        //   {
        //     id: 3,
        //     fecha: '2023-10-26',
        //     hora: '16:00',
        //     mascota: { nombre: 'Rocky', tipo: 'Perro', raza: 'Bulldog' },
        //     cliente: { nombre: 'Carlos Ruiz' },
        //     veterinario: { nombre: 'Dr. Roberto García' },
        //     motivo: 'Cirugía Dental',
        //     estado: 'confirmada',
        //   },
        //   {
        //     id: 4,
        //     fecha: '2023-10-24',
        //     hora: '11:00',
        //     mascota: { nombre: 'Coco', tipo: 'Ave', raza: 'Loro' },
        //     cliente: { nombre: 'Sofia Diaz' },
        //     veterinario: { nombre: 'Dra. Ana Martínez' },
        //     motivo: 'Control',
        //     estado: 'cancelada',
        //   },
        //   {
        //     id: 5,
        //     fecha: '2023-11-01',
        //     hora: '08:00',
        //     mascota: { nombre: 'Thor', tipo: 'Perro', raza: 'Husky' },
        //     cliente: { nombre: 'Pedro Pascal' },
        //     veterinario: { nombre: 'Dr. Roberto García' },
        //     motivo: 'Urgencia',
        //     estado: 'pendiente',
        //   },
        // ]);
      } catch (error) {
        console.error('Error cargando citas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCitas();
  }, []);

  // console.log(sortOrder)

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
  const getFilteredAndSortedCitas = () => {
    let result = [...citas];

    // 1. Filtro Texto (Cliente o Mascota)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (c) => c.dueno_nombre.toLowerCase().includes(lowerTerm) || c.mascota_nombre.toLowerCase().includes(lowerTerm)
      );
    }

    // 2. Filtro Tipo Mascota
    if (filterType !== 'todos') {
      result = result.filter((c) => c.mascota_tipo === filterType);
    }

    // 3. Filtro Veterinario
    if (filterVet !== 'todos') {
      result = result.filter((c) => c.vet_nombre === filterVet);
    }

    // 4. Filtro Fecha
    if (filterDate) {
      result = result.filter((c) => c.fechaProgramada === filterDate);
    }

    // // 5. Ordenamiento (Fecha + Hora)
    // result.sort((a, b) => {
    //   const dateA = new Date(`${a.fecha}T${a.hora}`);
    //   const dateB = new Date(`${b.fecha}T${b.hora}`);
    //   return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    // });

    return result;
  };

  const filteredCitas = getFilteredAndSortedCitas();

  // Obtener listas únicas para los selects
  const uniqueVets = [...new Set(citas.map((c) => c.vet_nombre))];
  const uniqueTypes = [...new Set(citas.map((c) => c.mascota_tipo))];

  // Utils Visuales
  const getStatusBadge = (estado) => {
    const styles = {
      pendiente: 'bg-amber-100 text-amber-700 border-amber-200',
      confirmada: 'bg-blue-100 text-blue-700 border-blue-200',
      completada: 'bg-green-100 text-green-700 border-green-200',
      cancelada: 'bg-red-50 text-red-700 border-red-100 line-through opacity-70',
    };

    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${
          styles[estado] || styles.pendiente
        }`}
      >
        {estado}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 pb-12">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="text-blue-600" />
            Control de Citas
          </h1>
          <p className="text-slate-500 text-sm ml-9">Gestiona la agenda global de la veterinaria.</p>
        </div>

        <button
          onClick={() => navigate('/citas/nueva')}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nueva Cita
        </button>
      </div>

      {/* --- BARRA DE FILTROS AVANZADA --- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 space-y-4">
        {/* Fila Superior: Buscador y Fecha */}
        <div className="flex flex-col md:flex-row gap-4 items-center align-center ">
          <div className="relative flex-1 group ">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por cliente o mascota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-2/3 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            />
          </div>

          <div className=" w-1/2 md:w-auto">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('todos');
                setFilterVet('todos');
                setFilterDate('');
              }}
              className="text-blue-600 font-medium hover:underline"
            >
              Limpiar todos los filtros
            </button>
          </div>
        </div>
        

        {/* Fila Inferior: Dropdowns y Ordenamiento */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Filtro Tipo */}
            <div className="relative w-full sm:w-40">
              <PawPrint className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-50"
              >
                <option value="todos">Todas Mascotas</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={14}
              />
            </div>

            {/* Filtro Veterinario */}
            <div className="relative w-full sm:w-56">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={filterVet}
                onChange={(e) => setFilterVet(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-50"
              >
                <option value="todos">Todos los Veterinarios</option>
                {uniqueVets.map((vet) => (
                  <option key={vet} value={vet}>
                    {vet}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={14}
              />
            </div>
          </div>

          {/* Botón Ordenar */}
          {/* <button
            onClick={() => setSortOrder((prev) => (prev === '-' ? '+' : '-'))}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors w-full md:w-auto justify-center"
          >
            <ArrowUpDown size={16} />
            {sortOrder === '+' ? 'Más antiguas primero' : 'Más recientes primero'}
          </button> */}
        </div>
      </div>

      {/* --- TABLA DE CITAS --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-2"></div>
            <p>Cargando agenda...</p>
          </div>
        ) : filteredCitas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Fecha y Hora</th>
                  <th className="px-6 py-4">Paciente</th>
                  <th className="px-6 py-4">Veterinario</th>
                  <th className="px-6 py-4">Motivo</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  {/* <th className="px-6 py-4 text-right">Acciones</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCitas.map((cita) => (
                  <tr
                    key={cita.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                    onClick={() => navigate(`/citas/${cita.cita_id}`)}
                  >
                    {/* Fecha */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{cita.fechaProgramada}</span>
                        <span className="text-slate-500 text-sm flex items-center gap-1">
                          <Clock size={12} /> {cita.hora}
                        </span>
                      </div>
                    </td>

                    {/* Paciente y Dueño */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {cita.mascota_nombre[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{cita.mascota_nombre}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{cita.mascota_tipo}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="flex items-center gap-1">
                              <User size={10} /> {cita.dueno_nombre}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Veterinario */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                          <Stethoscope size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{cita.vet_nombre}</span>
                      </div>
                    </td>

                    {/* Motivo */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{cita.motivo}</span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 text-center">{getStatusBadge(cita.asistencia)}</td>

                    {/* Acciones
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="bg-slate-50 p-4 rounded-full inline-block mb-4">
              <Filter size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No se encontraron citas</h3>
            <p className="text-slate-400 mt-1">Intenta cambiar los filtros seleccionados.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('todos');
                setFilterVet('todos');
                setFilterDate('');
              }}
              className="mt-6 text-blue-600 font-medium hover:underline"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapper para previsualización
export default CitasPage;
