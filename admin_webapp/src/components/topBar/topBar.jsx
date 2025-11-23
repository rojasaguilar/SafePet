import React from "react";

function Topbar() {
  return (
    <>
      <header className="w-full bg-white rounded-3xl shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="https://via.placeholder.com/40"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">Dr. James</p>
            <p className="text-xs text-gray-500">Veterinarian</p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded-xl w-64"
        />
      </header>
    </>
  );
}

export default Topbar;
