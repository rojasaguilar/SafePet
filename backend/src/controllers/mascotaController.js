import { db } from "./../config/firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore/lite";

const mascotaCol = collection(db, "mascotas");

const getMascotas = async (req, res) => {
  //   console.log(req.params);
  try {
    const mascotasSnapshot = await getDocs(mascotaCol);

    const mascotas = mascotasSnapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        ui_dueno: d.ui_dueno.id,
        nombre: d.nombre,
        raza: d.raza,
        tipo: d.tipo,
        fechaNacimiento: d.fechaNacimiento,
        vet_id: d.vet_id ?? null,
      };
    });

    return res.status(200).json({
      status: "success",
      results: mascotas.length,
      data: mascotas,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

const getMascota = async (req, res) => {
  const { mascotaId } = req.params;

  try {
    const mascotaRef = doc(db, "mascotas", mascotaId);

    const mascotaSnapshot = await getDoc(mascotaRef);

    if (!mascotaSnapshot.exists()) {
      return res.status(404).json({
        status: "fail",
        message: `Mascota con id ${mascotaId} no encontrada`,
      });
    }
    const d = mascotaSnapshot.data();

    const mascota = {
      id: mascotaSnapshot.id,
      ui_dueno: d.ui_dueno.id,
      nombre: d.nombre,
      raza: d.raza,
      tipo: d.tipo,
      fechaNacimiento: d.fechaNacimiento.toDate(),
      vet_id: d.vet_id ?? null,
    };

    return res.status(200).json({
      status: "success",
      data: mascota,
    });
  } catch (error) {
    console.error("Error getOneMascota:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
};

const createMascota = async (req, res) => {
  const data = req.body;

  try {
    const duenoRef = doc(db, "usuarios", data.ui_dueno);

    const mascota = {
      ui_dueno: duenoRef,
      nombre: data.nombre,
      raza: data.raza,
      tipo: data.tipo,
      fechaNacimiento: new Date(data.fechaNacimiento),
      vet_id: data.vet_id ?? null,
    };
    const mascotaRef = await addDoc(mascotaCol, mascota);

    return res.status(201).json({
      status: "success",
      message: "Mascota registrada correctamente",
      data: { id: mascotaRef.id, ...data },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
};

export default {
  getMascotas,
  getMascota,
  createMascota,
};
