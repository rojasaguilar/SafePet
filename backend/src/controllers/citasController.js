import { db } from '../config/firebase.js';

const citasCol = db.collection('citas');

const getCitas = async (req, res) => {
  // ... tu lógica de query existente ...
  let query = citasCol;
  const { mascotaId, uid, sort, vet_id } = req.query;

  if (mascotaId) {
    const mascotaRef = db.collection('mascotas').doc(mascotaId);
    query = query.where('mascota_id', '==', mascotaRef);
  }

  if (vet_id) {
    const vetRef = db.collection('usuarios').doc(vet_id);
    query = query.where('vet_id', '==', vetRef);
  }

  if (uid) {
    const usuarioRef = db.collection('usuarios').doc(uid);
    query = query.where('ui_dueno', '==', usuarioRef);
  }

  if (sort) {
    query = query.orderBy(sort, 'asc');
  }

  try {
    const snapshot = await query.get();

    // --- CORRECCIÓN 1: EARLY RETURN ---
    // Si no hay documentos, retornamos respuesta vacía INMEDIATAMENTE.
    // Esto evita que db.getAll() falle por recibir arrays vacíos.
    if (snapshot.empty) {
      return res.status(200).json({
        status: 'success',
        results: 0,
        data: [],
      });
    }

    const citasDocs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 1. Recolectar todos los IDs únicos
    const vetIDs = new Set();
    const mascotaIDs = new Set();
    const duenoIDs = new Set();

    citasDocs.forEach((c) => {
      // Validación extra por si vet_id viene null en BD
      if (c.vet_id) vetIDs.add(c.vet_id.id);
      if (c.mascota_id) mascotaIDs.add(c.mascota_id.id);
      if (c.ui_dueno) duenoIDs.add(c.ui_dueno.id);
    });

    // --- CORRECCIÓN 2: Declarar mapas FUERA de los IFs ---
    // Para evitar errores de "variable not defined"
    const vetsMap = {};
    const mascotasMap = {};
    const duenosMap = {};

    // 2. Hacer batch fetch SOLO si hay IDs
    const promises = [];

    if (vetIDs.size > 0) {
      promises.push(
        db
          .getAll(...[...vetIDs].map((id) => db.collection('usuarios').doc(id)))
          .then((snaps) =>
            snaps.forEach((doc) => (vetsMap[doc.id] = doc.data()))
          )
      );
    }

    if (mascotaIDs.size > 0) {
      promises.push(
        db
          .getAll(
            ...[...mascotaIDs].map((id) => db.collection('mascotas').doc(id))
          )
          .then((snaps) =>
            snaps.forEach((doc) => (mascotasMap[doc.id] = doc.data()))
          )
      );
    }

    if (duenoIDs.size > 0) {
      promises.push(
        db
          .getAll(
            ...[...duenoIDs].map((id) => db.collection('usuarios').doc(id))
          )
          .then((snaps) =>
            snaps.forEach((doc) => (duenosMap[doc.id] = doc.data()))
          )
      );
    }

    // Esperar a que todas las consultas auxiliares terminen
    await Promise.all(promises);

    // 4. Construir respuesta final
    const citas = citasDocs.map((d) => {
      // Manejo seguro de fechas
      const fecha = d.fechaProgramada
        ? new Date(d.fechaProgramada.toDate())
        : new Date();
      const dia = fecha.toLocaleString('es-ES', { day: '2-digit' });
      const mes = fecha.toLocaleString('es-ES', { month: 'long' });
      const hora = fecha.toLocaleTimeString('en-US', { timeStyle: 'short' });

      // --- CORRECCIÓN 3: OPTIONAL CHAINING (?.) ---
      // Usamos ?. para evitar crash si falta algún dato relacionado
      const vetData = d.vet_id ? vetsMap[d.vet_id.id] : null;
      const mascotaData = d.mascota_id ? mascotasMap[d.mascota_id.id] : null;
      const duenoData = d.ui_dueno ? duenosMap[d.ui_dueno.id] : null;

      return {
        cita_id: d.id,
        ...d,
        vet_nombre: vetData
          ? `${vetData.nombre} ${vetData.apellidos}`
          : 'No asignado',
        fechaProgramada: `${dia} de ${mes} del ${fecha.getFullYear()}`,
        hora,
        fechaCreacion: d.fechaCreacion ? d.fechaCreacion.toDate() : null,
        mascota_nombre: mascotaData ? mascotaData.nombre : 'Desconocido',
        mascota_tipo: mascotaData ? mascotaData.tipo : 'Desconocido',
        dueno_nombre: duenoData
          ? `${duenoData.nombre} ${duenoData.apellidos}`
          : 'Desconocido',
      };
    });

    return res.status(200).json({
      status: 'success',
      results: citas.length,
      data: citas,
    });
  } catch (error) {
    console.error('Error en getCitas:', error);
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

  console.log(data);

  //REFERENCIAS

  const mascotaRef = db.collection('mascotas').doc(data.mascota_id);
  const vetRef = db.collection('usuarios').doc(data.vet_id);
  const clinicaRef = db.collection('clinicas').doc(data.clinica_id);

  const mascotaSnapshot = await mascotaRef.get();
  const vetSnapshot = await vetRef.get();
  const clinicaSnapshot = await clinicaRef.get();

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
  const mascota = await mascotaRef.get();
  console.log(mascota.data());
  const duenoRef = db.collection('usuarios').doc(mascota.data().ui_dueno.id);
  const duenoSnapshot = await duenoRef.get();

  if (!duenoSnapshot.exists) {
    return res.status(400).json({
      status: 'FAIL',
      message: `Dueño con id ${data.ui_dueno} no existe`,
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

    return res.status(201).json({
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
    motivo: body.motivo || '',
    notas: body.notas || '',
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
  deleteCita,
};
