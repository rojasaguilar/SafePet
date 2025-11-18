import { db } from './../config/firebase.js';

const clinicasCol = db.collection('clinicas');

// Obtener todas las clínicas
const getClinicas = async (req, res) => {
  try {
    const snapshot = await clinicasCol.get();

    const clinicas = snapshot.docs.map((doc) => ({
      clinica_id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      status: 'success',
      results: clinicas.length,
      data: clinicas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'fail',
      error: error.message,
    });
  }
};

// Obtener una clínica por ID
const getClincia = async (req, res) => {
  const { id } = req.params;

  try {
    const clinicaRef = db.collection('clinicas').doc(id);
    const clinicaSnapshot = await clinicaRef.get();

    if (!clinicaSnapshot.exists) {
      return res.status(404).json({
        status: 'fail',
        message: `Clinica con id ${id} no encontrada`,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'clinica obtenida',
      data: {
        clinica_id: clinicaSnapshot.id,
        ...clinicaSnapshot.data(),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'fail',
      error: error.message,
    });
  }
};

export default {
  getClinicas,
  getClincia,
};
