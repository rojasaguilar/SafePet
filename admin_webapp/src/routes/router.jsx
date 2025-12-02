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
import AgregarCita from '../pages/Citas/AgregarCita.jsx';

// Usuarios
import VeterinariosPage from './../pages/Usuarios/VeterinariosPage.jsx';
import UsuariosPage from './../pages/Usuarios/UsuariosPage.jsx';
import UsuarioPage from '../pages/Usuarios/UsuarioPage.jsx';
import AgregarUsuario from '../pages/Usuarios/AgregarUsuario.jsx';

// Clínicas
import ClinicasPage from './../pages/Clinicas/ClinicasPage.jsx';
import AgregarClinica from './../pages/Clinicas/AgregarClinica.jsx'

import PrivateRoute from './PrivateRoute.jsx';
import ClinicaPage from '../pages/Clinicas/ClinicaPage.jsx';

const router = createBrowserRouter([
  { path: '/landing', element: <LandingPage /> },

  {
    path: '/',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },

      // PACIENTES
      {
        path: 'pacientes',
        element: (
          <PrivateRoute>
            <PacientesPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'pacientes/nuevo',
        element: (
          <PrivateRoute>
            <AgregarPaciente />
          </PrivateRoute>
        ),
      },
      {
        path: 'pacientes/:id',
        element: (
          <PrivateRoute>
            <PacientePage />
          </PrivateRoute>
        ),
      },

      // CITAS
      {
        path: 'citas',
        element: (
          <PrivateRoute>
            <CitasPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'citas/:id',
        element: (
          <PrivateRoute>
            <CitaPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'citas/nueva',
        element: (
          <PrivateRoute>
            <AgregarCita />
          </PrivateRoute>
        ),
      },

      // USUARIOS
      {
        path: 'veterinarios',
        element: (
          <PrivateRoute>
            <VeterinariosPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'usuarios',
        element: (
          <PrivateRoute>
            <UsuariosPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'usuarios/:id',
        element: (
          <PrivateRoute>
            <UsuarioPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'usuarios/nuevo',
        element: (
          <PrivateRoute>
            <AgregarUsuario />
          </PrivateRoute>
        ),
      },

      // CLÍNICAS
      {
        path: 'clinicas',
        element: (
          <PrivateRoute>
            <ClinicasPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'clinicas/:id',
        element: (
          <PrivateRoute>
            <ClinicaPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'clinicas/nueva',
        element: (
          <PrivateRoute>
            <AgregarClinica />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
