import { MarsIcon, VenusIcon } from 'lucide-react';

function Sexo({ sexo }) {
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <>
      {sexo === 'macho' ? (
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="bg-white w-fit p-4 rounded-full">
            <MarsIcon color="#2196f3" />
          </div>
          <p>{capitalize(sexo)}</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="bg-white w-fit p-4 rounded-full">
            <VenusIcon color="#ab47bc" />
          </div>
          <p>{capitalize(sexo)}</p>
        </div>
      )}
    </>
  );
}

export default Sexo;
