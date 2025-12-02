import { db } from '../config/firebase.js';

const citasCol = db.collection('citas');

const getCitas = async (req, res) => {
  //MIDDLEWARE PARA VER TOKEN, PERO FALTA ADECUARLO PORQUE SE TINENE QUE MANDAR POR HEADER
  // const {loggedUser} = req

  // console.log(loggedUser)
  //MIDDLEWARE PARA VER TOKEN, PERO FALTA ADECUARLO PORQUE SE TINENE QUE MANDAR POR HEADER
  let query = citasCol;
  const { mascotaId, uid } = req.query;
  console.log(mascotaId);

  if (mascotaId) {
    const mascotaRef = db.collection('mascotas').doc(mascotaId);
    query = query.where('mascota_id', '==', mascotaRef);
  }

  if (uid) {
    const usuarioRef = db.collection('usuarios').doc(uid);
    query = query.where('ui_dueno', '==', usuarioRef);
  }

  // if (req.queryObject) {
  //   query = query.where('mascota_id', '==', req.mascotaId);
  // }

  try {
    const snapshot = await query.get();

    const citasDocs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 1. Recolectar todos los IDs únicos
    const vetIDs = new Set();
    const mascotaIDs = new Set();
    const duenoIDs = new Set();

    citasDocs.forEach((c) => {
      vetIDs.add(c.vet_id.id);
      mascotaIDs.add(c.mascota_id.id);
      duenoIDs.add(c.ui_dueno.id);
    });

    // 2. Hacer batch fetch (1 consulta por colección)
    const vetsSnap = await db.getAll(
      ...[...vetIDs].map((id) => db.collection('usuarios').doc(id))
    );
    const mascotasSnap = await db.getAll(
      ...[...mascotaIDs].map((id) => db.collection('mascotas').doc(id))
    );
    const duenosSnap = await db.getAll(
      ...[...duenoIDs].map((id) => db.collection('usuarios').doc(id))
    );

    // 3. Crear diccionarios
    const vetsMap = {};
    vetsSnap.forEach((doc) => (vetsMap[doc.id] = doc.data()));

    const mascotasMap = {};
    mascotasSnap.forEach((doc) => (mascotasMap[doc.id] = doc.data()));

    const duenosMap = {};
    duenosSnap.forEach((doc) => (duenosMap[doc.id] = doc.data()));

    console.log(duenosMap);

    // 4. Construir respuesta final
    const citas = citasDocs.map((d) => {
      const fecha = new Date(d.fechaProgramada.toDate());
      const dia = fecha.toLocaleString('es-ES', { day: '2-digit' });
      const mes = fecha.toLocaleString('es-ES', { month: 'long' });
      const hora = fecha.toLocaleTimeString('en-US', { timeStyle: 'short' });

      return {
        cita_id: d.id,
        ...d,
        vet_nombre: `${vetsMap[d.vet_id.id].nombre} ${
          vetsMap[d.vet_id.id].apellidos
        }`,
        fechaProgramada: `${dia} de ${mes} del ${fecha.getFullYear()}`,
        hora,
        fechaCreacion: d.fechaCreacion.toDate(),
        mascota_nombre: mascotasMap[d.mascota_id.id].nombre,
        mascota_tipo: mascotasMap[d.mascota_id.id].tipo,
        dueno_nombre: `${duenosMap[d.ui_dueno.id].nombre} ${
          duenosMap[d.ui_dueno.id].apellidos
        }`,
      };
    });

    return res.status(200).json({
      status: 'success',
      results: citas.length,
      data: citas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', error: error.message });
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

    const fechaProgramada = new Date(citadData.fechaProgramada.toDate());
    const diaProgramacion = fechaProgramada.toLocaleString('es-ES', {
      day: '2-digit',
    });
    const mesProgramacion = fechaProgramada.toLocaleString('es-ES', {
      month: 'long',
    });
    const horaProgramacion = fechaProgramada.toLocaleTimeString('en-US', {
      timeStyle: 'short',
    });

    const fechaCreacion = new Date(citadData.fechaCreacion.toDate());
    const diaCreacion = fechaCreacion.toLocaleString('es-ES', {
      day: '2-digit',
    });
    const mesCreacion = fechaCreacion.toLocaleString('es-ES', {
      month: 'long',
    });

    const duenoRef = db.collection('usuarios').doc(citadData.ui_dueno.id);
    const vetRef = db.collection('usuarios').doc(citadData.vet_id.id);
    const mascotaRef = db.collection('mascotas').doc(citadData.mascota_id.id);

    const duenoSnap = await duenoRef.get();
    const vetSnap = await vetRef.get();
    const mascotaSnap = await mascotaRef.get();

    const duenoData = duenoSnap.data();
    const vetData = vetSnap.data();
    const mascotaData = mascotaSnap.data();

    const cita = {
      cita_id: ref.id,
      ...citadData,
      fechaProgramada: `${diaProgramacion} de ${mesProgramacion} del ${fechaProgramada.getFullYear()}`,
      fechaCreacion: `${diaCreacion} de ${mesCreacion} del ${fechaCreacion.getFullYear()}`,
      hora: horaProgramacion,
      vet_nombre: `${vetData.nombre} ${vetData.apellidos}`,
      dueno_nombre: `${duenoData.nombre} ${duenoData.apellidos}`,
      dueno_telefono: duenoData.telefono,
      dueno_email: duenoData.email,
      mascota_nombre: `${mascotaData.nombre}`,
      mascota_tipo: mascotaData.tipo,
      mascota_raza: mascotaData.raza,
      mascota_sexo: mascotaData.sexo,
      mascota_peso: mascotaData.peso,
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

const updateCita = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const updatedCita = {
    asistencia: body.asistencia,
    motivo: body.motivo,
    notas: body.notas,
  };

  if (body.fechaProgramada) {
    body.fechaProgramada = new Date(body.fechaProgramada);
    console.log(body.fechaProgramada);
    updatedCita.fechaProgramada = body.fechaProgramada;
  }

  try {
    const citaRef = citasCol.doc(id);
    await citaRef.update(updatedCita);
    return res.status(200).json({
      message: 'Cita actualizada correctamente',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const deleteCita = async (req, res) => {
  const { id } = req.params;

  try {
    const citaRef = citasCol.doc(id);
    const snapshot = await citaRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({
        status: 'fail',
        message: `Cita con id ${id} no existe`,
      });
    }

    await citaRef.delete();

    return res.status(200).json({
      status: 'success',
      message: 'Cita cancelada correctamente',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
};

export default {
  getCitas,
  getCita,
  addCita,
  updateCita,
  deleteCita
};