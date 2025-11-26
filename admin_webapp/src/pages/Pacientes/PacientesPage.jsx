import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function PacientesPage() {
  const [mascotas, setMascotas] = useState([]);

  const navigate = useNavigate();

  const goToDetail = (id) => {
    navigate(`/pacientes/${id}`,{
      state: {mascotaId: id}
    });
  };

  useEffect(() => {
    const getMascotas = async () => {
      const { data } = await axios.get("http://localhost:3456/api/v1/mascotas");

      console.log(data.data);

      setMascotas(data.data);
    };

    getMascotas();
  }, []);

  return (
    <>
      {mascotas.length > 0 ? (
        <div>
          {
            <table className="table-fixed">
              <thead>
                <tr>
                  <th className="w-2/12">Paciente</th>
                  <th className="w-2/12">Tipo</th>
                  <th className="w-2/12">Raza</th>
                  <th className="w-2/12">Sexo</th>
                  <th className="w-2/12">Peso</th>
                  <th className="w-2/12">Dueño</th>
                  <th className="w-2/12">Veterinario</th>
                </tr>
              </thead>
              <tbody>
                {mascotas.map((mascota) => (
                  <tr
                    key={mascota.id}
                    className="text-center"
                    onClick={() => goToDetail(mascota.id)}
                  >
                    <td>{mascota.nombre}</td>
                    <td>{mascota.tipo}</td>
                    <td>{mascota.raza}</td>
                    <td>{mascota.sexo}</td>
                    <td>{mascota.peso}</td>
                    <td>{mascota.nombre_dueno}</td>
                    <td>{mascota.vet_nombre ?? "Sin asignar"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      ) : (
        <div>
          <h1>Sin mascotas</h1>
        </div>
      )}
    </>
  );
}

export default PacientesPage;
