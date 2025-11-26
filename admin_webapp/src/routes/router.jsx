import { createBrowserRouter } from 'react-router-dom';

//LAYOUT
import DashbouardLayout from './../DashboardLayout.jsx';

//PAGES
import PacientesPage from './../pages/PacientesPage.jsx';
import CitasPage from './../pages/CitasPage.jsx';
import VeterinariosPage from './../pages/VeterinariosPage.jsx';
import ClinicasPage from './../pages/ClinicasPage.jsx';
import PacientePage from '../pages/PacientePage.jsx';
import CitaPage from '../pages/CitaPage.jsx';
import UsuariosPage from '../pages/UsuariosPage.jsx';
import UsuarioPage from '../pages/UsuarioPage.jsx';
import Dashboard from '../pages/Dashboard.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashbouardLayout />,
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
