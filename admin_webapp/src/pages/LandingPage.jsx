import { useState, useEffect } from 'react';
import {
  PawPrint,
  X,
  Mail,
  Lock,
  Check,
  Menu,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
  Activity,
  Calendar,
  Shield,
  MessageCircleWarning,
} from 'lucide-react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoginError, setIsLoginError] = useState({
    open: false,
  });
  const [scrolled, setScrolled] = useState(false);
  //   const [credenciales, setCredenciales] = useState({});

  // Efecto para la barra de navegación al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();

  // Método para manejar el envío del formulario de login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // TODO: Conectar con servicio de autenticación (ej. Firebase Auth)
    console.log('Iniciando sesión con:', email, '...');
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_BASE}/auth/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            app: 'admin-webapp',
          },
        }
      );
      closeLoginModal();
      console.log(data);

      sessionStorage.setItem('loggedUser', JSON.stringify(data));

      navigate('/dashboard');
    } catch (error) {
      //AGREGA MODAL MANEJANDO RESPUESTA
      const { data } = error.response;
      closeLoginModal();

      setIsLoginError({
        open: true,
        code: data.code,
      });
    }
  };

  // Método para abrir el modal
  const openLoginModal = () => {
    setIsLoginOpen(true);
  };

  const closeError = () => {
    setIsLoginError({
      open: false,
    });

    setIsLoginOpen(true);
  };

  // Método para cerrar el modal
  const closeLoginModal = () => {
    setIsLoginOpen(false);
  };

  // Método para recuperación de contraseña
  const handleForgotPassword = () => {
    // TODO: Implementar lógica de recuperación
    console.log('Solicitud de recuperación de contraseña');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden selection:bg-blue-200">
      {/* --- NAVBAR --- */}
      <nav
        className={`fixed w-full z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <PawPrint size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">SafePet</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Servicios
            </a>
            <a href="#about" className="hover:text-blue-600 transition-colors">
              Nosotros
            </a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">
              Contacto
            </a>
          </div>

          <button
            onClick={openLoginModal}
            className="hidden md:flex px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 active:scale-95"
          >
            Portal Administrativo
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Decorative Blobs (Estilo referencia web) */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 w-[400px] h-[400px] bg-purple-100/50 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold tracking-wide uppercase">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
              Panel Administrativo
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1]">
              Todo para tu <span className="text-blue-600">veterinaria</span> en un solo lugar.
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Gestiona historias clínicas, agenda citas, envía recordatorios automatizados y controla tu inventario. La
              solución integral para clínicas modernas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={openLoginModal}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group"
              >
                Acceder al Panel
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center gap-6 pt-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-1 rounded-full text-green-600">
                  <Check size={14} strokeWidth={3} />
                </div>
                Gestión Fácil
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-1 rounded-full text-green-600">
                  <Check size={14} strokeWidth={3} />
                </div>
                Soporte 24/7
              </div>
            </div>
          </div>

          {/* Right Content (Visual Composition) */}
          <div className="relative mt-12 lg:mt-0 hidden md:block">
            {/* Circle Backgrounds similar to reference */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-tr from-purple-400 to-purple-600 rounded-full opacity-20 blur-2xl"></div>

            {/* Composition Container */}
            <div className="relative z-10 grid grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/5 translate-y-12">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
                  <Calendar size={24} />
                </div>
                <h3 className="font-bold text-lg mb-1">Citas</h3>
                <p className="text-gray-500 text-sm">Agenda optimizada</p>
                <div className="mt-4 flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                  ))}
                </div>
              </div>

              {/* Card 2 (Image) */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5 aspect-square bg-blue-100 flex items-end justify-center">
                <img
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Dog"
                  className="object-cover w-full h-full mix-blend-multiply"
                />
              </div>

              {/* Card 3 (Image) */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5 aspect-square bg-purple-100 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Dog"
                  className="object-cover w-full h-full mix-blend-multiply"
                />
              </div>

              {/* Card 4 */}
              <div className="bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-600/20 text-white -translate-y-12 flex flex-col justify-between">
                <div>
                  <Activity size={32} className="mb-4 opacity-80" />
                  <h3 className="font-bold text-2xl">24/7</h3>
                  <p className="text-blue-100 text-sm">Monitoreo</p>
                </div>
                <div className="w-full bg-blue-500/50 h-1.5 rounded-full mt-4">
                  <div className="w-3/4 bg-white h-1.5 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- FEATURES SECTION (Minimal) --- */}
      <section className="py-20 bg-white" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Diseñado para veterinarias</h2>
            <p className="text-gray-600">Herramientas potentes encapsuladas en una interfaz amigable.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={32} />,
                title: 'Seguridad de Datos',
                desc: 'Historiales encriptados y backups automáticos.',
              },
              {
                icon: <Calendar size={32} />,
                title: 'Agenda Inteligente',
                desc: 'Recordatorios por WhatsApp y Email automáticos.',
              },
              {
                icon: <Activity size={32} />,
                title: 'Panel de Control',
                desc: 'Métricas de rendimiento de tu clínica en tiempo real.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all group cursor-default"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <PawPrint className="text-blue-500" />
            <span className="text-xl font-bold">SafePet Admin</span>
          </div>
          <p className="text-slate-400 text-sm">© 2025 SafePet Inc. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <div className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
              <Facebook size={18} />
            </div>
            <div className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
              <Instagram size={18} />
            </div>
            <div className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
              <Twitter size={18} />
            </div>
          </div>
        </div>
      </footer>

      {/* --- LOGIN MODAL / PORTAL --- */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeLoginModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header with Blue Curve (Referencia App Móvil) */}
            <div className="bg-blue-600 pt-10 pb-8 px-8 text-center relative">
              <button
                onClick={closeLoginModal}
                className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="bg-white/10 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center backdrop-blur-md mb-4">
                <PawPrint size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Bienvenido de nuevo</h2>
              <p className="text-blue-100 text-sm mt-1">Accede a tu panel administrativo</p>
            </div>

            {/* Form */}
            <div className="p-8 pt-4">
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Correo Electrónico</label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
                      size={20}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="admin@safepet.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Contraseña</label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
                      size={20}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
                >
                  Iniciar Sesión
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  ¿No tienes una cuenta? <span className="font-bold text-gray-800">Contacta a soporte</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- LOGIN FAILED MODAL --- */}
      {isLoginError.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header with Blue Curve (Referencia App Móvil) */}
            <div className="bg-white pt-10 pb-8 px-8 text-center relative flex flex-col gap-6">
              <div className="bg-red-100 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center backdrop-blur-md">
                <MessageCircleWarning size={32} className="text-red-400" />
              </div>

              <h2 className="text-2xl font-bold text-red-400 m-0 p-0">{isLoginError.code}</h2>

              <button
                onClick={() => closeError()}
                className="w-full py-4 bg-red-400 hover:bg-red-700 text-white font-bold rounded-full shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
