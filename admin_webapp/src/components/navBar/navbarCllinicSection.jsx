import React from "react";
import { Calendar, HouseHeartIcon, PawPrint, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import "./../../styles/navbarStyles.css";

function NavbarCllinicSection() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <p>Clinica</p>
        <div class="links" className="flex flex-col gap-2">
          
          <Link to="pacientes" className="link">
            <PawPrint />
            Pacientes
          </Link>

          <Link to="citas" className="link">
            <Calendar />
            Citas
          </Link>

          <Link to="veterinarios" className="link">
            <Stethoscope />
            Veterinarios
          </Link>

          <Link to="clinicas" className="link">
            <HouseHeartIcon />
            Clinicas
          </Link>
        </div>
      </div>
    </>
  );
}

export default NavbarCllinicSection;
