import axios, { Axios } from 'axios';
import { useState, useEffect } from 'react';
import TablaUsuarios from '../../components/TablaUsuarios';

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get('http://localhost:3456/api/v1/usuarios');
      setUsuarios(data.data);
    };
    fetchUsers();
  }, []);
  return (
    <>
      <h2 className="text-3xl font-semibold p-0 m-0">Lista de Usuarios</h2>
      {usuarios.length > 0 ? <TablaUsuarios usuarios={usuarios} /> : <div>no Usuarios</div>}
    </>
  );
}

export default UsuariosPage;
