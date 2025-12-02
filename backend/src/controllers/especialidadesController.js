import { db } from '../config/firebase.js';

const especialidadesCol = db.collection('especialidades');

const getEspecialidades = async (req, res) => {
  try {
    const especialidadesRef = await especialidadesCol.get();

    const especialidades = especialidadesRef.docs.map((doc) => {
      const d = doc.data();

      return {
        id: doc.id,
        ...d,
      };
    });

    return res.status(200).json({
      status: 'succes',
      data: especialidades,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ...error,
    });
  }
};

export default {
  getEspecialidades,
};
