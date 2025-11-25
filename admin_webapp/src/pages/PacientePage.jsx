import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PacientePage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [mascota, setMascota] = useState({
    id: state.mascotaId,
  });

  useEffect(() => {
    const getMascota = async () => {
      const { data } = await axios.get(
        `http://localhost:3456/api/v1/mascotas/${mascota.id}`
      );
      setMascota({
        ...mascota,
        ...data.data,
      });
    };

    getMascota();
    console.log(mascota);
  }, []);

  //retroceder a pantalla anterior
  const goBack = () => navigate(-1);

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-row gap-3 items-center">
        <ArrowLeft onClick={() => goBack()} />
        <p>Detalles del paciente</p>
      </div>

      <div className="grid grid-cols-2 gap-8 p-3">
        {/* INFO PERFIL */}
        <div className="flex-col">
          {/* FOTO PERFIL */}
          <div className="w-full h-43 bg-amber-50 flex justify-start items-end p-5 rounded-3xl">
            {mascota.tipo === "gato" ? (
              <img
                src="/src/assets/cat.jpg"
                alt="d"
                className="w-20 h-20 rounded-full relative"
              />
            ) : (
              <img
                src="/src/assets/dog.jpg"
                alt="d"
                className="w-20 h-20 rounded-full relative"
              />
            )}
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
