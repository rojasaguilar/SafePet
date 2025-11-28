import axios from 'axios';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sexo from '../../components/Sexo';
import Peso from '../../components/peso';
import Tipo from '../../components/tipo';
import Edad from '../../components/Edad';
import CitasLista from '../../components/PacienteComponents/CitasLista';

function PacientePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [mascota, setMascota] = useState({
    id,
  });

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    const getMascota = async () => {
      const { data } = await axios.get(`http://localhost:3456/api/v1/mascotas/${mascota.id}`);
      setMascota({
        // ...mascota,
        ...data.data,
      });
    };

    getMascota();
  }, [id]);
  
  //retroceder a pantalla anterior
  const goBack = () => navigate('/pacientes');

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-row gap-3 items-center">
        <ArrowLeft onClick={() => goBack()} />
        <p>Detalles del paciente</p>
      </div>

      <div className="grid grid-cols-2 gap-8 p-5">
        {/* INFO PERFIL */}
        <div className="flex flex-col gap-5">
          {/* FOTO PERFIL */}
          <div className="w-full h-38 bg-amber-500 flex justify-start items-end rounded-3xl">
            <img
              src={`/src/assets/${mascota.tipo}.jpg`}
              alt=""
              className="w-25 h-25 rounded-full relative left-10 top-2"
            />
          </div>

          {/* NOMBRE MASCOTA */}
          <p className="text-2xl font-semibold">{capitalize(mascota.nombre)}</p>

          {/* CONTACTO */}
          <div className="grid grid-cols-2 space-y-4">
            {/* NOMBRE DUEÑO */}
            <div
              className="flex flex-row items-center gap-2 cursor-pointer"
              onClick={() => navigate(`/usuarios/${mascota.ui_dueno}`)}
            >
              <div className="p-2 bg-blue-200 rounded-full">
                <User />
              </div>
              <div className="flex flex-col">
                <p className="text-gray-600 text-xs">Dueño</p>
                <p>{mascota.nombre_dueno}</p>
              </div>
            </div>

            {/* TELEFONO DUEÑO */}
            <div className="flex flex-row items-center gap-2">
              <div className="p-2 bg-blue-200 rounded-full">
                <Phone />
              </div>
              <div className="flex flex-col">
                <p className="text-gray-600 text-xs">Telefono</p>
                <p>{mascota.telefono_dueno}</p>
              </div>
            </div>

            {/* CORREO DUEÑO */}
            <div className="flex flex-row items-center gap-2">
              <div className="p-2 bg-blue-200 rounded-full">
                <Mail />
              </div>
              <div className="flex flex-col">
                <p className="text-gray-600 text-xs">Correo</p>
                <p>{mascota.correo_dueno}</p>
              </div>
            </div>
          </div>

          {/* BANNER INFO */}
          <div className="bg-blue-200 p-8 rounded-xl grid grid-cols-4">
            <Sexo sexo={mascota.sexo} />
            <Peso peso={mascota.peso} />
            <Tipo tipo={mascota.tipo} />
            <Edad fechaNacimiento={mascota.fechaNacimiento} />
          </div>
        </div>
        {/* TODAS LAS CITAS */}

        <CitasLista url={`${import.meta.env.VITE_BACKEND_URL_BASE}/citas?mascotaId=${id}`} />
      </div>
    </>
  );
}

export default PacientePage;
