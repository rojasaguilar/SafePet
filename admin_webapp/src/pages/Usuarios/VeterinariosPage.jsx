import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import TablaUsuarios from '../../components/TablaUsuarios';
import TablaVeterinarios from '../../components/TablaVeterinarios';

function VeterinariosPage() {
  const [veterinarios, setVeterinarios] = useState([]);
  const navigate = useNavigate();
  // const {}

  useEffect(() => {
    const getVeterinarios = async () => {
      const { data } = await axios.get('http://localhost:3456/api/v1/usuarios?rol=veterinario');
      setVeterinarios(data.data);
    };
    getVeterinarios();
  }, []);

  console.log(veterinarios);

  return (
    <>
      <div>
        <h2 className="text-3xl font-semibold p-0 m-0">Lista de Veterinarios</h2>
        {/* CONTADOR Y SELECTOR PARA DESACTIVAR  */}
        <div></div>
      </div>
      {veterinarios.length < 0 ? (
        <div>VeterinariosPage</div>
      ) : (
       <TablaVeterinarios veterinarios={veterinarios}/>
      )}
    </>
  );
}

export default VeterinariosPage;
