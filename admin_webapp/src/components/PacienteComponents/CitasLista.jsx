import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import EstadoCita from './EstadoCita';
import { Calendar } from 'lucide-react';

function CitasLista({ url }) {
  const navigate = useNavigate();

  function parseFecha(fecha) {
    const date = new Date(fecha);
    return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
  }

  const [citas, setCitas] = useState([]);

  useEffect(() => {
    if (!url) return;

    const getCitas = async () => {
      const { data } = await axios.get(`${url}`);
      setCitas(data.data);
    };

    getCitas();
  }, []);

  if (citas.length === 0) return <p>Sin citas</p>;
  return (
    <>
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
              <tr key={cita.cita_id} onClick={() => navigate(`/citas/${cita.cita_id}`)}>
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
    </>
  );
}

export default CitasLista;
