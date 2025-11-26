import NavbarCllinicSection from './navbarCllinicSection';
import { Link } from 'react-router-dom';
import { Home, Users } from 'lucide-react';

function NavBar() {
  return (
    <>
      <aside className="rounded-2xl bg-slate-100 w-fit h-[calc(100vh-3rem)] p-4">
        <h2 className="text-2xl font-semibold mb-6">SafePet</h2>
        <div className="flex flex-col gap-6">
          <Link to={'/dashboard'} className="link">
            <Home />
            Dashboard
          </Link>
          <NavbarCllinicSection />
          <Link to={'/usuarios'} className="link">
            <Users />
            Usuarios
          </Link>
        </div>
      </aside>
    </>
  );
}

export default NavBar;
