import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MarsIcon, VenusIcon } from 'lucide-react';

function CarrucelMascotas({ url }) {
  const navigate = useNavigate();

  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getEdad(fechaNacimiento) {
    const birthDay = new Date(fechaNacimiento);
    const currentDate = new Date();

    const birthYear = birthDay.getFullYear();
    const currentYear = currentDate.getFullYear();

    if (currentYear - birthYear > 0) return `${currentYear - birthYear} año`;

    const birthMonth = birthDay.getMonth();
    const currentMont = currentDate.getMonth();

    if (currentMont - birthMonth > 0) return `${currentMont - birthMonth} meses`;
  }

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(url);
        setMascotas(data.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    if (url) {
      fetchMascotas();
    }
  }, [url]);

  if (loading) return <p>Cargando mascotas...</p>;
  if (mascotas.length === 0) return <p>Sin mascotas...</p>;

  return (
    <div className="w-full flex flex-col gap-4 ">
      <h3 className="self-center text-xl font-semibold">Tus mascotas</h3>

      <div className="">
        {mascotas.map((mascota) => (
          <div
            className="flex flex-col w-fit hover:scale-102 transition hover:shadow-lg hover:shadow-gray-400/50 rounded-b-3xl"
            onClick={() => navigate(`/pacientes/${mascota.id}`)}
          >
            <img src={`/src/assets/${mascota.tipo}.jpg`} alt="" className="rounded-t-3xl h-28" />
            <div className="p-4 space-y-2">
              {/* NOMBRE Y SEXO */}
              <div className="bg-white h-fit flex flex-row items-center justify-between gap-1 rounded-3xl">
                <p className="font-semibold">{capitalize(mascota.nombre)}</p>
                {mascota.sexo === 'hembra' ? (
                  <VenusIcon size={18} className=" text-pink-700" />
                ) : (
                  <MarsIcon size={18} className=" text-blue-800" />
                )}
              </div>
              <p className="border border-gray-300 w-fit py-1 px-3 rounded-xl text-sm">
                {getEdad(mascota.fechaNacimiento)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarrucelMascotas;
