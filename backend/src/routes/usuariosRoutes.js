import express from 'express';

//MASCOTA ROUTER FOR SUB-ROUTES
import mascotaRouter from './mascotasRoutes.js';

//USUARIO CONTROLLER
import usuarioController from '../controllers/usuarioController.js';

//MIDDLEWARES
// import { getDuenoId } from '../middlewares/getDuenoId.js';
import { incomingApp } from '../middlewares/getIncomingApp.js';

const router = express.Router();

router
  .route('/')
  // .get(incomingApp, usuarioController.getUsers)
  .get(usuarioController.getUsers)
  .post(usuarioController.createUser);

router.route('/:id').get(usuarioController.getUser);

// router.use('/:id/mascotas', getDuenoId, mascotaRouter);

export default router;
