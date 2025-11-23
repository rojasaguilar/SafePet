import React from "react";
import NavbarCllinicSection from "./navbarCllinicSection";

function NavBar() {
  return (
    <>
      <aside className="rounded-2xl bg-slate-100 w-fit h-[calc(100vh-3rem)] p-4">
        <h2 className="text-2xl font-semibold mb-6">SafePet</h2>
        <NavbarCllinicSection />
      </aside>
    </>
  );
}

export default NavBar;
