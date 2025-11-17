import express from "express";
import mascotaRouter from "./mascotasRoutes.js";

import usuarioController from "../controllers/usuarioController.js";

import { getDuenoId } from "../middlewares/getDuenoId.js";

const router = express.Router();

router.route("/").get(usuarioController.getUsers);

// router.use("/:id/mascotas", getDuenoId, mascotaRouter);

export default router;
