import axios from "axios";
import { useState, useEffect } from "react";

function PacientesPage() {
  const [mascotas, setMascotas] = useState([]);

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
            mascotas.map((mascota) => {
              
            })
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
