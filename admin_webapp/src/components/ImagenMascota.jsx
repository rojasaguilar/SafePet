import catImage from './../assets/gato.jpg';
import dogImage from './../assets/perro.jpg';

function ImagenMascota({ tipo }) {
  if (tipo.toLowerCase() === 'perro')
    return <img className="object-cover h-18 w-18 rounded-full" src={dogImage} alt="" />;
  if (tipo.toLowerCase() === 'gato')
    return <img className="object-cover h-18  w-18 rounded-full" src={catImage} alt="" />;
}

export default ImagenMascota;
