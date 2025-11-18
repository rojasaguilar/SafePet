import { db } from '../config/firebase.js';

const citasCol = db.collection('citas');

const getCitas = async (req, res) => {
  try {
    const snapshot = await citasCol.get();

    const citas = snapshot.docs.map((doc) => {
      const d = doc.data();

      return {
        cita_id: doc.id,
        mascota_id: d.mascota_id,
        vet_id: d.vet_id,
        clinica_id: d.clinica_id,
        fechaProgramada: d.fechaProgramada.toDate(),
        asistencia: d.asistencia,
        fechaCrecion: d.fechaCreacion.toDate(),
      };
    });

    return res.status(200).json({
      status: 'success',
      results: citas.length,
      data: citas,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 'fail',
      error,
    });
  }
};

export default {
  getCitas,
};
