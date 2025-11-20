import { db } from '../config/firebase.js';
import admin from 'firebase-admin';

// Referencia a colección
const usuariosCol = db.collection('usuarios');

const getUsers = async (req, res) => {
  try {
    const snapshot = await usuariosCol.get();

    const usuarios = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        uid: doc.id,
        nombre: d.nombre,
        apellidos: d.apellidos,
        username: d.username,
        email: d.email,
        rol: d.rol,
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
    // Datos para Firestore
    const usuario = {
      nombre: data.nombre,
      apellidos: data.apellidos,
      username: data.username || `${data.nombre}_${data.apellidos}`,
      email: data.email,
      rol: data.rol,
    };

    // Guardar en Firestore
    const usuarioGuardado = await usuariosCol.doc(userRecord.uid).set(usuario);

    //VERIFICAR SI SE INSERTÓ, SI SI PUES AGREGAR EN AUTHORIZATION
    // Crear usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: data.username || `${data.nombre}_${data.apellidos}`,
    });

    return res.status(200).json({
      status: 'success',
      message: 'usuario registrado satisfactoriamente',
      data: usuario,
    });
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
