import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sexo from '../components/Sexo';
import Peso from '../components/peso';
import Tipo from '../components/tipo';
import Edad from '../components/Edad';

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
console.log(mascota.fechaNacimiento)
  //retroceder a pantalla anterior
  const goBack = () => navigate('/home/pacientes/');

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-row gap-3 items-center">
        <ArrowLeft onClick={() => goBack()} />
        <p>Detalles del paciente</p>
      </div>

      <div className="grid grid-cols-2 gap-8 p-5">
        {/* INFO PERFIL */}
        <div className="flex-col">
          {/* FOTO PERFIL */}
          <div className="w-full h-48 bg-amber-500 flex justify-start items-end rounded-3xl">
            {mascota.tipo === 'gato' ? (
              <img src="/src/assets/cat.jpg" alt="d" className="w-25 h-25 rounded-full relative left-10 top-2" />
            ) : (
              <img src="/src/assets/dog.jpg" alt="d" className="w-20 h-20 rounded-full relative bottom-0 " />
            )}
          </div>

          <p className="text-2xl font-semibold">{capitalize(mascota.nombre)}</p>
          <div className="bg-blue-200 p-8 rounded-xl grid grid-cols-4">
            <Sexo sexo={mascota.sexo} />
            <Peso peso={mascota.peso} />
            <Tipo tipo={mascota.tipo}/>
            <Edad fechaNacimiento={mascota.fechaNacimiento}/>
          </div>
        </div>
        {/* TODAS LAS CITAS */}
        <div>
          <p>Citas</p>
        </div>
      </div>
    </>
  );
}

export default PacientePage;
