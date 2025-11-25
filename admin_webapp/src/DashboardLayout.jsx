import React from "react";
import NavBar from "./components/navBar/navBar";
import Topbar from "./components/topBar/topBar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <>
      <div className="min-h-screen bg-white p-6">
        <div className="flex gap-6">
          <NavBar />

          <main className="flex-1 flex flex-col gap-6">
            <Topbar />
            <section className="bg-white rounded-3xl shadow-sm p-6 h-full">
              {/* <h1 className="text-2xl font-semibold">Dashboard Content</h1> */}
              <Outlet/>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
