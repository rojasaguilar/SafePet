import { db } from '../config/firebase.js';
import admin from 'firebase-admin';

// referencia a colección
const mascotaCol = db.collection('mascotas');

const getMascotas = async (req, res) => {
  //ANALIZA DE QUIEN VIENE LA PETICION (TOKEN)
  const { loggedUser } = req;
  const { app } = req.headers;

  //VERIFICA PARA FILTRO DE DUENO
  const { ui_dueno, tipo } = req.query;

  let query = mascotaCol;

  if (app === 'client-movile') {
    console.log(loggedUser);
    query = query.where('ui_dueno', '==', loggedUser.uid);
  }

  // Si viene ?ui_dueno=xxxxx
  if (ui_dueno) {
    const duenoRef = db.collection('usuarios').doc(ui_dueno);

    query = query.where('ui_dueno', '==', duenoRef);
  }

  if (tipo) {
    console.log(tipo);
    query = query.where('tipo', '==', tipo);
    //  console.log(query.)
  }

  try {
    const snapshot = await query.get();

    const mascotas = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const d = doc.data();
        const duenoRef = db.collection('usuarios').doc(d.ui_dueno.id);

        let vet;
        if (d.vet_id) {
          const vetRef = db.collection('usuarios').doc(d.vet_id.id);
          const vetSnap = await vetRef.get();
          vet = vetSnap.data();
        }

        const duenoSnap = await duenoRef.get();

        const dueno = duenoSnap.data();

        return {
          id: doc.id,
          ui_dueno: duenoSnap.id,
          ...d,
          nombre_dueno: `${dueno.nombre} ${dueno.apellidos}`,
          fechaNacimiento: d.fechaNacimiento.toDate(),
          vet_id: d.vet_id ?? null,
          vet_nombre: vet ? `${vet.nombre} ${vet.apellidos}` : null,
        };
      })
    );

    return res.status(200).json({
      status: 'success',
      results: mascotas.length,
      data: mascotas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const getMascota = async (req, res) => {
  const { mascotaId } = req.params;

  try {
    const ref = mascotaCol.doc(mascotaId);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({
        status: 'fail',
        message: `Mascota con id ${mascotaId} no encontrada`,
      });
    }

    const d = snap.data();

    const duenoRef = db.collection('usuarios').doc(d.ui_dueno.id);
    const duenoSnap = await duenoRef.get();
    const dueno = duenoSnap.data();

    const mascota = {
      id: snap.id,
      ...d,
      ui_dueno: duenoSnap.id,
      nombre_dueno: `${dueno.nombre} ${dueno.apellidos}`,
      telefono_dueno: dueno.telefono,
      correo_dueno: dueno.email,
      fechaNacimiento: d.fechaNacimiento.toDate(),
      vet_id: d.vet_id?.id ?? null,
    };

    return res.status(200).json({ status: 'success', data: mascota });
  } catch (error) {
    console.error('Error getMascota:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

const createMascota = async (req, res) => {
  const data = req.body;

  const usuarioRef = db.collection('usuarios').doc(data.ui_dueno);

  try {
    const mascota = {
      ui_dueno: usuarioRef,
      nombre: data.nombre,
      raza: data.raza,
      tipo: data.tipo,
      fechaNacimiento: new Date(data.fechaNacimiento),
      vet_id: data.vet_id ? db.collection('usuarios').doc(data.vet_id) : null,
      peso: data.peso,
      sexo: data.sexo,

    };

    const ref = await mascotaCol.add(mascota);

    return res.status(201).json({
      status: 'success',
      message: 'Mascota registrada correctamente',
      data: { id: ref.id, ...mascota },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const deleteMascota = async (req, res) => {
  const { mascotaId } = req.params;

  try {
    const ref = mascotaCol.doc(mascotaId);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({
        status: 'fail',
        message: `Mascota con id ${mascotaId} no encontrada`,
      });
    }

    await ref.delete();

    return res.status(200).json({
      status: 'success',
      message: 'Mascota eliminada correctamente',
    });
  } catch (error) {
    console.error('Error deleteMascota:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const updateMascota = async (req, res) => {
  const { mascotaId } = req.params;
  const data = req.body;

  try {
    const ref = mascotaCol.doc(mascotaId);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({
        status: 'fail',
        message: `Mascota con id ${mascotaId} no encontrada`,
      });
    }

    const mascotaActualizada = {
      nombre: data.nombre,
      raza: data.raza,
      tipo: data.tipo,
      sexo: data.sexo,
      peso: data.peso,
      fechaNacimiento: new Date(data.fechaNacimiento),
      vet_id: data.vet_id ? db.collection('usuarios').doc(data.vet_id) : null,
    };

    await ref.update(mascotaActualizada);

    return res.status(200).json({
      status: 'success',
      message: 'Mascota actualizada correctamente',
      data: { id: mascotaId, ...mascotaActualizada },
    });
  } catch (error) {
    console.error('Error updateMascota:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

export default {
  getMascotas,
  getMascota,
  createMascota,
  deleteMascota,
  updateMascota
};
