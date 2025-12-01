import express from 'express';
import mascotaController from '../controllers/mascotaController.js';

//MIDDLEARES
import { verifyUserToken } from './../middlewares/verifyToken.js';

// import citasRouter from './citasRouter.js';

// const router = express.Router({ mergeParams: true });
const router = express.Router();

router
  .route('/')
  .get(verifyUserToken, mascotaController.getMascotas)
  .post(mascotaController.createMascota);

router
.route('/:mascotaId')
.get(mascotaController.getMascota)
.delete(mascotaController.deleteMascota)
.put(mascotaController.updateMascota);
// router.use('/:mascotaId/citas', citasRouter);

export default router;
