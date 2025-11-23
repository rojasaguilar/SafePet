import { createBrowserRouter } from "react-router-dom";

//LAYOUT
import DashbouardLayout from './../DashboardLayout.jsx'

//PAGES
import PacientesPage from "./../pages/PacientesPage.jsx";
import CitasPage from './../pages/CitasPage.jsx';
import VeterinariosPage from './../pages/VeterinariosPage.jsx';
import ClinicasPage from './../pages/ClinicasPage.jsx';

const router = createBrowserRouter([
  {
    path: "/home",
    element: <DashbouardLayout/>,
    children: [
      { path: "pacientes", element: <PacientesPage /> },
      { path: "citas", element: <CitasPage/> },
      { path: "veterinarios", element: <VeterinariosPage/> },
      { path: "clinicas", element: <ClinicasPage/> },
    ],
  },
]);

export default router;
