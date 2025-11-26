import { db } from '../config/firebase.js';

const citasCol = db.collection('citas');

const getCitas = async (req, res) => {
  //MIDDLEWARE PARA VER TOKEN, PERO FALTA ADECUARLO PORQUE SE TINENE QUE MANDAR POR HEADER
  // const {loggedUser} = req

  // console.log(loggedUser)
  //MIDDLEWARE PARA VER TOKEN, PERO FALTA ADECUARLO PORQUE SE TINENE QUE MANDAR POR HEADER
  let query = citasCol;
  const { mascotaId } = req.query;
  console.log(mascotaId);

  if (mascotaId) {
    const mascotaRef = db.collection('mascotas').doc(mascotaId)
    query = query.where('mascota_id', '==', mascotaRef);
  }

  // if (req.queryObject) {
  //   query = query.where('mascota_id', '==', req.mascotaId);
  // }

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
  const { id } = req.params;

  try {
    const ref = citasCol.doc(id);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      return res.status(404).json({
        status: 'fail',
        message: `Cita  id ${id} no existe`,
      });
    }

    const citadData = snapshot.data();

    const cita = {
      cita_id: ref.id,
      ...citadData,
      fechaCreacion: citadData.fechaCreacion.toDate(),
      fechaProgramada: citadData.fechaProgramada.toDate(),
    };

    return res.status(200).json({
      status: 'success',
      data: cita,
    });
  } catch (error) {
    console.log(error);
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
  const vetRef = db.collection('usuarios').doc(data.vet_id);
  const clinicaRef = db.collection('clinicas').doc(data.clinica_id);

  const duenoSnapshot = await duenoRef.get();
  const mascotaSnapshot = await mascotaRef.get();
  const vetSnapshot = await vetRef.get();
  const clinicaSnapshot = await clinicaRef.get();

  if (!duenoSnapshot.exists) {
    return res.status(400).json({
      status: 'FAIL',
      message: `Dueño con id ${data.ui_dueno} no existe`,
    });
  }
  if (!mascotaSnapshot.exists) {
    return res.status(400).json({
      status: 'FAIL',
      message: `Mascota con id ${data.mascota_id} no existe`,
    });
  }
  if (!vetSnapshot.exists) {
    return res.status(400).json({
      status: 'FAIL',
      message: `Veterinario con id ${data.vet_id} no existe`,
    });
  }
  if (!clinicaSnapshot.exists) {
    return res.status(400).json({
      status: 'FAIL',
      message: `Clinica con id ${data.clinica_id} no existe`,
    });
  }

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
