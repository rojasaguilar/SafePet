import { createBrowserRouter } from 'react-router-dom';

// Layout
import DashboardLayout from './../DashboardLayout.jsx';

// Pages
import LandingPage from '../pages/LandingPage.jsx';
import Dashboard from '../pages/Dashboard.jsx';

// Pacientes
import PacientesPage from './../pages/Pacientes/PacientesPage.jsx';
import PacientePage from '../pages/Pacientes/PacientePage.jsx';
import AgregarPaciente from '../pages/Pacientes/AgregarPaciente.jsx';

// Citas
import CitasPage from './../pages/Citas/CitasPage.jsx';
import CitaPage from './../pages/Citas/CitaPage.jsx';

// Usuarios
import VeterinariosPage from './../pages/Usuarios/VeterinariosPage.jsx';
import UsuariosPage from './../pages/Usuarios/UsuariosPage.jsx';
import UsuarioPage from '../pages/Usuarios/UsuarioPage.jsx';

// Clínicas
import ClinicasPage from './../pages/Clinicas/ClinicasPage.jsx';
import AgregarCita from '../pages/Citas/AgregarCita.jsx';
import AgregarUsuario from '../pages/Usuarios/AgregarUsuario.jsx';

const router = createBrowserRouter([
  { path: '/landing', element: <LandingPage /> },

  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },

      // PACIENTES
      { path: 'pacientes', element: <PacientesPage /> },
      { path: 'pacientes/nuevo', element: <AgregarPaciente /> },
      { path: 'pacientes/:id', element: <PacientePage /> },

      // CITAS
      { path: 'citas', element: <CitasPage /> },
      { path: 'citas/:id', element: <CitaPage /> },
      { path: 'citas/nueva', element: <AgregarCita /> },

      // USUARIOS
      { path: 'veterinarios', element: <VeterinariosPage /> },
      { path: 'usuarios', element: <UsuariosPage /> },
      { path: 'usuarios/:id', element: <UsuarioPage /> },
      { path: 'usuarios/nuevo', element: <AgregarUsuario /> },

      // CLÍNICAS
      { path: 'clinicas', element: <ClinicasPage /> },
    ],
  },
]);

export default router;
