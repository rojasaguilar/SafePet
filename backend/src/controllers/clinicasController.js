import { db } from './../config/firebase.js';

const clinicasCol = db.collection('clinicas');

// Obtener todas las clínicas
const getClinicas = async (req, res) => {
  try {
    const snapshot = await clinicasCol.get();

    const clinicas = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const clinicaData = doc.data();

        const encargadoRef = db
          .collection('usuarios')
          .doc(clinicaData.encargado.id);
        const encargado = await encargadoRef.get();
        const encargadoData = encargado.data();

        return {
          clinica_id: doc.id,
          ...clinicaData,
          encargado: `${encargadoData.nombre} ${encargadoData.apellidos}`,
        };
      })
    );

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

    const clinicaData = clinicaSnapshot.data();

    const encargadoRef = db
      .collection('usuarios')
      .doc(clinicaData.encargado.id);
    const encargadoSnap = await encargadoRef.get();
    const encargadoData = encargadoSnap.data();

    return res.status(200).json({
      status: 'success',
      message: 'clinica obtenida',
      data: {
        clinica_id: clinicaSnapshot.id,
        ...clinicaData,
        encargado_nombre: `${encargadoData.nombre} ${encargadoData.apellidos}`,
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

const addClinica = async (req, res) => {
  const { body } = req;

  const datosClinica = { ...body, estado: 'activo' };

  //desestructurar servicios
  const { servicios } = datosClinica;
  const arrayServicios = servicios.split(',');
  datosClinica.servicios = arrayServicios.filter((servicio) => {
    if (servicio.trim() !== '' || servicio.lengt < 3) return servicio.trim();
  });

  try {
    const usuariosRef = db.collection('usuarios').doc(datosClinica.encargado);
    const usuarioSnap = await usuariosRef.get();

    if (!usuarioSnap.exists) {
      return res.status(404).json({
        status: 'fail',
        message: 'encargado no encontrado',
        datosClinica,
      });
    }

    datosClinica.encargado = usuariosRef;

    await clinicasCol.add(datosClinica);

    return res.status(201).json({
      status: 'success',
      message: 'clinica registrada',
      datosClinica,
    });
  } catch (error) {
    console.log(error);
    return res.status(201).json({
      status: 'success',
      message: 'clinica registrada',
      datosClinica,
    });
  }
};

const deleteClinica = async (req, res) => {
  const { id } = req.params;

  try {
    const clinicaRef = clinicasCol.doc(id);

    const updatedClinica = await clinicaRef.update({ estado: 'inactivo' });

    return res.status(200).json({
      status: 'succes',
      message: 'clinca desactivada',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'clinca NO desactivada',
      error,
    });
  }
};

const updateClinica = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const updatedClinica = { ...body };

  try {
    const clinicaRef = clinicasCol.doc(id);

    await clinicaRef.update(updatedClinica);

    return res.status(200).json({
      status: 'succes',
      message: 'clinca actualizada',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'clinca NO desactivada',
      error,
    });
  }
};

export default {
  getClinicas,
  getClincia,
  addClinica,
  deleteClinica,
  updateClinica
};
