import { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

function VeterinariosPage() {
  const [veterinarios, setVeterinarios] = useState([]);

  // const {}

  useEffect(() => {
    const getVeterinarios = async () => {
      const { data } = await axios.get('http://localhost:3456/api/v1/usuarios?rol=veterinario');
      setVeterinarios(data.data);
    };
    getVeterinarios();
  },[]);

return(

  <>
  <div>
    <h2 className='text-3xl font-semibold'>Lista de Veterinarios</h2>
    <div>

    </div>
  </div>
  {
  veterinarios.length < 0
  ? <div>VeterinariosPage</div>
  : <div></div>
}
  </>
)


}

export default VeterinariosPage;
