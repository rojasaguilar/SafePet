import { db } from '../config/firebase.js';
import admin from 'firebase-admin';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseAuth } from '../config/firebaseClient.js';

const usersCol = db.collection('usuarios');

const login = async (req, res) => {
  const { email, password } = req.body;
  const { app } = req.headers;
  //   console.log(email)
  try {
    //VERIFICANDO SI EXISTE USUARIO
    const user = await admin.auth().getUserByEmail(email);

    const userRef = usersCol.doc(user.uid);
    const userSnapshot = await userRef.get();
    const userData = userSnapshot.data();

    const { estado } = userData;

    if (!estado) {
      return res.status(401).json({
        message: 'Usuario inactivo',
      });
    }

    //VERIFICAR NIVEL DE ROL
    if (app === 'admin-webapp') {
      const { rol } = userData;
      if (rol === 'usuario') {
        return res.status(403).json({
          message: 'Sin privilegios para acceder',
        });
      }
    }

    //VERIFICAR CREDENCIALES
    const userCred = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const idToken = await userCred.user.getIdToken(true);

    return res.status(200).json({
      idToken,
      ...userData,
    });
  } catch (error) {
    console.log(error);

    if (error.code === 'auth/user-not-found') {
      return res.status(401).json(error);
    }

    if (error.code === 'auth/invalid-credential') {
      return res.status(401).json(error);
    }

    return res.status(500).json({
      message: 'Server error',
    });
  }

  //   console.log(user);
};

const logOut = async (req, res) => {
  const { loggedUser } = req;
  try {
    console.log(" ======================= ")
    console.log(loggedUser.uid.id);
    await admin.auth().revokeRefreshTokens(loggedUser.uid.id);

    return res.status(200).json({
      message: 'Sesión cerrada',
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  login,
  logOut,
  //   signUp,
};
