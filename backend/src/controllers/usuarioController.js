import { db } from "../config/firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore/lite";

const usuariosCol = collection(db, "usuarios");

const getUsers = async (req, res) => {
  const usuariosSnapshot = await getDocs(usuariosCol);

  try {
    const usuarios = usuariosSnapshot.docs.map((doc) => {
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
      status: "success",
      results: usuarios.length,
      data: usuarios,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};

export default {
  getUsers,
};
