import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, Camera, User, PawPrint, Calendar, Activity, Save, X } from 'lucide-react';

function AgregarPaciente() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [usuarios, setUsuarios] = useState([]);

  const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'Perro',
    raza: '',
    sexo: 'Macho',
    peso: '',
    fechaNacimiento: '',
    color: '',
    ui_dueno: '',
  });

  useEffect(() => {
    const fetchUsuarios = async () => {
      setIsLoading(true);
      try {
        // --- CÓDIGO REAL ---
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/usuarios?rol=usuario`);
        setUsuarios(data.data);
      } catch (error) {
        console.error('Error cargando clínica:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuarios();
  }, []);
  // Manejador de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(formData);
  console.log(usuarios);

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Enviando datos...', formData);

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL_BASE}/mascotas`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'app': 'admin-webapp',
          Authorization: `Bearer ${loggedUser.idToken}`,
        },
      });

      if (response.status === 201) return navigate('/pacientes');
    } catch (error) {
      console.error('Error al crear paciente:', error);
      alert('Hubo un error al guardar. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate('/pacientes')}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Registrar Nuevo Paciente</h1>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* --- COLUMNA DERECHA: DATOS --- */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sección: Datos Básicos */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <PawPrint className="text-blue-500" size={20} />
                  Información de la Mascota
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nombre */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del Paciente</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Max"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  {/* Tipo */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo / Especie</label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                    >
                      <option value="Perro">Perro</option>
                      <option value="Gato">Gato</option>
                    </select>
                  </div>

                  {/* Raza */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Raza</label>
                    <input
                      type="text"
                      name="raza"
                      value={formData.raza}
                      onChange={handleChange}
                      placeholder="Ej. Golden Retriever"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Sexo */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Sexo</label>
                    <div className="flex gap-4 mt-1">
                      <label
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border cursor-pointer transition-all ${
                          formData.sexo === 'Macho'
                            ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="sexo"
                          value="Macho"
                          checked={formData.sexo === 'Macho'}
                          onChange={handleChange}
                          className="hidden"
                        />
                        Macho
                      </label>
                      <label
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border cursor-pointer transition-all ${
                          formData.sexo === 'Hembra'
                            ? 'bg-pink-50 border-pink-200 text-pink-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="sexo"
                          value="Hembra"
                          checked={formData.sexo === 'Hembra'}
                          onChange={handleChange}
                          className="hidden"
                        />
                        Hembra
                      </label>
                    </div>
                  </div>

                  {/* Peso */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Peso (kg)</label>
                    <div className="relative">
                      <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="number"
                        name="peso"
                        value={formData.peso}
                        onChange={handleChange}
                        placeholder="0.0"
                        step="0.1"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Fecha Nacimiento */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha de Nacimiento</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-600"
                      />
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Color / Señas</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="Ej. Manchas negras"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Dueño */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <User className="text-blue-500" size={20} />
                  Asignar Dueño
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Buscar Propietario</label>
                    <select
                      name="ui_dueno"
                      value={formData.ui_dueno}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      {usuarios.map((usuario) => (
                        <option
                          key={usuario.uid}
                          value={usuario.uid}
                        >{`${usuario.nombre} ${usuario.apellidos}`}</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                      Mostrando usuarios activos recientemente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- BOTONES DE ACCIÓN --- */}
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/pacientes')}
              className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Guardar Paciente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Wrapper para previsualización
export default AgregarPaciente;
