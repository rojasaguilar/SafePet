import { db } from "../config/firebase.js";
import admin from "firebase-admin";

// referencia a colección
const mascotaCol = db.collection("mascotas");


const getMascotas = async (req, res) => {
  try {
    let ref = mascotaCol;

    // Si viene ?ui_dueno=xxxxx
    if (req.query.ui_dueno) {
      ref = ref.where("ui_dueno", "==", req.query.ui_dueno);
    }

    const snapshot = await ref.get();

    const mascotas = snapshot.docs.map(doc => {
      const d = doc.data();

      return {
        id: doc.id,
        ui_dueno: d.ui_dueno,
        nombre: d.nombre,
        raza: d.raza,
        tipo: d.tipo,
        fechaNacimiento: d.fechaNacimiento.toDate(),
        vet_id: d.vet_id ?? null,
      };
    });

    return res.status(200).json({
      status: "success",
      results: mascotas.length,
      data: mascotas
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "fail",
      message: error.message
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
        status: "fail",
        message: `Mascota con id ${mascotaId} no encontrada`
      });
    }

    const d = snap.data();

    const mascota = {
      id: snap.id,
      ui_dueno: d.ui_dueno,
      nombre: d.nombre,
      raza: d.raza,
      tipo: d.tipo,
      fechaNacimiento: d.fechaNacimiento.toDate(),
      vet_id: d.vet_id ?? null
    };

    return res.status(200).json({ status: "success", data: mascota });

  } catch (error) {
    console.error("Error getMascota:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};


const createMascota = async (req, res) => {
  const data = req.body;

  try {
    const mascota = {
      ui_dueno: data.ui_dueno, // SOLO guarda el uid o cambia lógica
      nombre: data.nombre,
      raza: data.raza,
      tipo: data.tipo,
      fechaNacimiento: new Date(data.fechaNacimiento),
      vet_id: data.vet_id ?? null,
    };

    const ref = await mascotaCol.add(mascota);

    return res.status(201).json({
      status: "success",
      message: "Mascota registrada correctamente",
      data: { id: ref.id, ...mascota }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};


export default {
  getMascotas,
  getMascota,
  createMascota,
};
