import admin from 'firebase-admin';
import { db } from '../config/firebase.js';

export const verifyUserToken = async (req, res, next) => {
  //OBTENER TOKEN DE HEADER
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({
      message: 'Tienes que iniciar sesión',
    });

  const token = authorization.replace('Bearer ', '');

  // console.log(token);

  try {
    const tokenVerified = await admin.auth().verifyIdToken(token, true);

    console.log(tokenVerified.uid);

    const usuariosCol = db.collection('usuarios');

    const ref = usuariosCol.doc(tokenVerified.uid);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(401).json({
        message: 'Usuario no encontrado',
      });
    }

    req.loggedUser = {
      uid: ref,
      ...snap.data(),
    };

    next();
  } catch (error) {
    // Token revocado
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        message: 'Sesión expirada. Inicia sesión de nuevo.',
      });
    }

    // Token inválido o manipulado
    if (error.code === 'auth/argument-error') {
      return res.status(401).json({
        message: 'Token inválido.',
      });
    }

    return res.status(500).json({
      message: 'Error verificando token.',
      error: error.message,
    });
  }
};
