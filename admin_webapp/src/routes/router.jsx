import { createBrowserRouter } from 'react-router-dom';

//LAYOUT
import DashboardLayout from './../DashboardLayout.jsx';

//PAGES
import PacientesPage from './../pages/Pacientes/PacientesPage.jsx';
import CitasPage from './../pages/citas/CitasPage.jsx';
import VeterinariosPage from './../pages/Usuarios/VeterinariosPage.jsx';
import ClinicasPage from './../pages/Clinicas/ClinicasPage.jsx';
import PacientePage from '../pages/Pacientes/PacientePage.jsx';
import CitaPage from './../pages/Citas/CitaPage.jsx';
import UsuariosPage from './../pages/Usuarios/UsuariosPage.jsx  ';
import UsuarioPage from '../pages/Usuarios/UsuarioPage.jsx';
import Dashboard from '../pages/Dashboard.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },

      { path: 'pacientes', element: <PacientesPage /> },
      { path: 'pacientes/:id', element: <PacientePage /> },

      { path: 'citas', element: <CitasPage /> },
      { path: 'citas/:id', element: <CitaPage /> },

      { path: 'veterinarios', element: <VeterinariosPage /> },

      { path: 'clinicas', element: <ClinicasPage /> },

      { path: 'usuarios', element: <UsuariosPage /> },
      { path: 'usuarios/:id', element: <UsuarioPage /> },
    ],
  },
]);

export default router;
