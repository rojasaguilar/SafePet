import express from 'express';
import clinicasController from '../controllers/clinicasController.js';

const router = express.Router();

router
  .route('/')
  .get(clinicasController.getClinicas)
  .post(clinicasController.addClinica);

router
  .route('/:id')
  .get(clinicasController.getClincia)
  .delete(clinicasController.deleteClinica)
  .patch(clinicasController.updateClinica);

export default router;
