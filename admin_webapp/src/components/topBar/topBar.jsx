import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Topbar() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

  const handleLogOut = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/auth/logout`, {
      headers: {
        'Content-Type': 'application/json',
        app: 'admin-webapp',
        Authorization: `Bearer ${loggedUser.idToken}`,
      },
    });

    console.log(data);

    sessionStorage.removeItem('loggedUser');
    navigate('/landing');
  };

  return (
    <>
      <header className="w-full bg-white rounded-3xl shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="https://via.placeholder.com/40" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold">{`${loggedUser.nombre} ${loggedUser.apellidos}`}</p>
            <p className="text-xs text-gray-500">{loggedUser.rol}</p>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <input type="text" placeholder="Search..." className="border p-2 rounded-xl w-64" />

          <LogOut onClick={() => handleLogOut()} />
        </div>
      </header>
    </>
  );
}

export default Topbar;
