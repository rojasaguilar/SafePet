import admin from 'firebase-admin';
import { db } from '../config/firebase.js';
export const verifyUserToken = async (req, res, next) => {
  //MIDDLEWARE PARA VER TOKEN, PERO FALTA ADECUARLO PORQUE SE TINENE QUE MANDAR POR HEADER
  const { token } = req.body;
  //MIDDLEWARE PARA VER TOKEN, PERO FALTA ADECUARLO PORQUE SE TINENE QUE MANDAR POR HEADER

  try {
    const user = await admin.auth().verifyIdToken(token);
    if (!user) {
      return res.status(400).json({
        error,
        message: 'token invalido',
      });
    }

    const usuariosCol = db.collection('usuarios');

    const ref = usuariosCol.doc(user.uid);
    const snap = await ref.get();

    req.loggedUser = {
      uid: user.uid,
      ...snap.data(),
    };
    next();
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};
