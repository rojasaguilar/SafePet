import React from 'react';

function Raza({raza}) {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-1">
        <div className="bg-white w-fit p-4 rounded-full">
          <Weight color="#aed581" />
        </div>
        <p>{raza}</p>
      </div>
    </>
  );
}

export default Raza;
