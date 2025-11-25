import React from 'react';
import { CatIcon, DogIcon } from 'lucide-react';

function Tipo({ tipo }) {
  return (
    <>
      {tipo === 'gato' ? (
        <div className='flex flex-col justify-center items-center gap-1'>
          <div className="bg-white w-fit p-4 rounded-full">
            <CatIcon />
          </div>
          <p>{tipo}</p>
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center gap-1'>
          <div className="bg-white w-fit p-4 rounded-full">
            <DogIcon />
          </div>
          <p>{tipo}</p>
        </div>
      )}
    </>
  );
}

export default Tipo;
