import { db } from '../config/firebase.js';

const citasCol = db.collection('citas');

const getCitas = async (req, res) => {
  let query = citasCol;
  if (req.queryObject) {
    query = query.where('mascota_id', '==', req.mascotaId);
  }

  try {
    const snapshot = await query.get();

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
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error,
    });
  }
};

const getCita = async (req, res) => {
  const { cita_id } = req.body;

  try {
    const ref = db.doc(cita_id);
    const snapshot = await ref.get();

    if (!snapshot.exists()) {
      return res.status(404).json({
        status: 'fail',
        message: `Cita  id ${cita_id} no existe`,
      });
    }

    const cita = {
      cita_id: ref.id,
      ...snapshot.data(),
    };

    return res.status(200).json({
      status: 'success',
      data: cita,
    });
  } catch (error) {
    return res.status(200).json({
      status: 'fail',
      error,
    });
  }
};

const addCita = async (req, res) => {
  const data = req.body;

  //REFERENCIAS
  const duenoRef = db.collection('usuarios').doc(data.ui_dueno);
  const mascotaRef = db.collection('mascotas').doc(data.mascota_id);
  const vetRef = db.collection('usuario').doc(data.vet_id);
  const clinicaRef = db.collection('clinicas').doc(data.clinica_id);

  const cita = {
    ui_dueno: duenoRef,
    mascota_id: mascotaRef,
    vet_id: vetRef,
    clinica_id: clinicaRef,
    fechaProgramada: new Date(data.fechaProgramada),
    asistencia: 'pendiente',
    fechaCreacion: new Date(),
  };

  try {
    const citaRef = await citasCol.add(cita);
    const mascota = await mascotaRef.get();

    return res.status(200).json({
      status: 'success',
      message: `Cita para ${mascota.data().nombre} con fecha ${
        cita.fechaProgramada
      } agendada correctamente`,
      data: cita,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      error,
    });
  }
};

export default {
  getCitas,
  getCita,
  addCita,
};
