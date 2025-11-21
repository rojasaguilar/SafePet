import express from 'express';
import mascotaController from '../controllers/mascotaController.js';

// import citasRouter from './citasRouter.js';

// const router = express.Router({ mergeParams: true });
const router = express.Router();

router
  .route('/')
  .get(mascotaController.getMascotas)
  .post(mascotaController.createMascota);

router.route('/:mascotaId').get(mascotaController.getMascota);
// router.use('/:mascotaId/citas', citasRouter);

export default router;
