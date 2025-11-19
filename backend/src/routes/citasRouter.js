import express from 'express';

import citasController from '../controllers/citasController.js';

import { getQueryParams } from '../middlewares/queryObjectCitas.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getQueryParams, citasController.getCitas)
  .post(citasController.addCita);

export default router;
