import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, Camera, User, PawPrint, Calendar, Activity, Save, X, User2Icon } from 'lucide-react';
import './../../styles/inputsStyle.css';

function AgregarUsuario() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);

  const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

  // Efecto de Carga
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        setIsLoading(true);

        // --- CÓDIGO REAL ---
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/especialidades`);
        setEspecialidades(data.data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEspecialidades();
  }, []);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    especialidad: '',
    rol: 'usuario', // Valor por defecto
    telefono: '',
    username: '',
    email: '',
    password: ''
  });

  // Manejador de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toLowerCase(),
    }));
  };

  console.log(formData);

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Enviando datos...', formData);

      // --- AQUÍ TU LÓGICA DE AXIOS ---

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL_BASE}/usuarios`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loggedUser.idToken}`,
        },
      });

      if (response.status === 201) {
        alert('si');
        navigate('/usuarios'); // Redirigir a la lista
      }
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
        <h1 className="text-xl font-bold text-slate-800">Registrar Nuevo Usuario</h1>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* --- COLUMNA DERECHA: DATOS --- */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sección: Datos Básicos */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <User2Icon className="text-blue-500" size={20} />
                  Información del Usuario
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nombre */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del Usuario</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Carlos"
                      className="select"
                      required
                    />
                  </div>

                  {/* APELLIDOS */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Apellidos</label>
                    <input
                      type="text"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      placeholder="Ej. Casillas"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  {/* CORREO ELECTRONICO Y USUARIO */}
                  <div className="col-span-2">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electronico</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Ej. correo@gmail.com"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Ej. vet12"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                   {/* APELLIDOS */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  {/* ROL */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Rol</label>
                    <select name="rol" value={formData.rol} onChange={handleChange} className="select">
                      <option value="usuario">Usuario</option>
                      <option value="veterinario">Veterinario</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>

                  {/* TELEFONO */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Telefono</label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Ej. 311 100 3404"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* ESPECIALIDAD */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Especialidad</label>
                    <select
                      type="text"
                      disabled={formData.rol !== 'veterinario'}
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500  transition-all disabled:cursor-not-allowed disabled:text-slate-300 disabled:bg-slate-50"
                    >
                      {especialidades.map((especialidad) => (
                        <option value={especialidad.especialidad}>{especialidad.especialidad}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- BOTONES DE ACCIÓN --- */}
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/usuarios')}
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
                  Guardar Usuario
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
export default AgregarUsuario;
