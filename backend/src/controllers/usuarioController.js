import { db } from '../config/firebase.js';
import admin from 'firebase-admin';

// Referencia a colección
const usuariosCol = db.collection('usuarios');

const getUsers = async (req, res) => {
  let dbQuery = usuariosCol;

  //VERIFICAR SI HAY FILTROS
  const { query } = req;
  
  //SI HAY FILTROS, GENERA QUERY PARA FILTRAR
  if (query) {
    const filtros = Object.keys(query);
    filtros.forEach(filtro => dbQuery = dbQuery.where(filtro, "==", query[filtro]))
  }

  
  try {
    const snapshot = await dbQuery.get();

    const usuarios = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        uid: doc.id,
        ...d,
      };
    });

    return res.status(200).json({
      status: 'success',
      results: usuarios.length,
      data: usuarios,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const ref = usuariosCol.doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({
        status: 'fail',
        message: `usuario con el id ${id} no existe`,
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        uid: snap.id,
        ...snap.data(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  const data = req.body;

  try {
    // Crear usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: data.username || `${data.nombre}_${data.apellidos}`,
    });

    //SI SE PUDO REGISTRAR EN FIREBASE AUTH
    if (userRecord) {
      // Datos para Firestore
      const usuario = {
        nombre: data.nombre,
        apellidos: data.apellidos,
        username: data.username || `${data.nombre}_${data.apellidos}`,
        email: data.email,
        rol: data.rol,
        telefono: data.telefono,
        estado: true,
        especialidad: data.especialidad || null
      };

      // Guardar en Firestore
      const usuarioGuardado = await usuariosCol
        .doc(userRecord.uid)
        .set(usuario);

      return res.status(201).json({
        status: 'success',
        message: 'usuario registrado satisfactoriamente',
        data: {
          uid: userRecord.uid,
          ...usuario,
        },
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

export default {
  getUsers,
  getUser,
  createUser,
};
