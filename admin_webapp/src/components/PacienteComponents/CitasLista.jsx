import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CitaCard from './CitaCard';
import EstadoCita from './EstadoCita';

function CitasLista() {
  const { id } = useParams();
  console.log(`Id: ${id}`);

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
                <th className="bg-red-200  w-5/6">Cita</th>
                <th className="w-1/6">Estado</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.cita_id}>
                  <td className='p-2'>{cita.cita_id}</td>
                  <td className='p-2'>{<EstadoCita asistencia={cita.asistencia}/>}</td>
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
