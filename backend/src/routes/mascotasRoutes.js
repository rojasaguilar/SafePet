import express from "express";
import mascotaController from "../controllers/mascotaController.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(mascotaController.getMascotas)
  .post(mascotaController.createMascota);

router.route("/:mascotaId").get(mascotaController.getMascota);

export default router;
