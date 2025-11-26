import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import EstadoCita from './EstadoCita';
import { Calendar } from 'lucide-react';

function CitasLista() {
  const { id } = useParams();
  const navigate = useNavigate();

  function parseFecha(fecha) {
    const date = new Date(fecha);
    return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
  }

  const goToCita = (id) => navigate(`/citas/${id}`);

  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const getCitas = async () => {
      const { data } = await axios.get(`http://localhost:3456/api/v1/citas?mascotaId=${id}`);
      setCitas(data.data);
    };

    getCitas();
  }, []);

  return (
    <>
      {citas.length < 0 ? (
        <p>Sin citas</p>
      ) : (
        <div className="">
          <table>
            <thead>
              <tr className="min-w-full">
                <th className="bg-red-200  w-5/6 text-left">Cita</th>
                <th className="w-1/6 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.cita_id} onClick={() => goToCita(cita.cita_id)}>
                  <td className="p-2">
                    <div className="flex flex-row items-center gap-3">
                      <Calendar color="#616161" />
                      <div>
                        <p className=""> {`Cita #${cita.cita_id}`}</p>
                        <p className="text-gray-700 text-sm"> {parseFecha(cita.fechaProgramada)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2">{<EstadoCita asistencia={cita.asistencia} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default CitasLista;
