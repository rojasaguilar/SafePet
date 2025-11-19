import express from 'express';

import citasController from '../controllers/citasController.js';

import { getQueryParams } from '../middlewares/queryObjectCitas.js';
import { verifyUserToken } from '../middlewares/verifyToken.js';
const router = express.Router({ mergeParams: true });

router
  .route('/')
  //MIDDLEWARE PARA VER TOKEN, PERO FALTA ADECUARLO PORQUE SE TINENE QUE MANDAR POR HEADER
  .get(verifyUserToken, getQueryParams, citasController.getCitas)
  //MIDDLEWARE PARA VER TOKEN, PERO FALTA ADECUARLO PORQUE SE TINENE QUE MANDAR POR HEADER
  .post(citasController.addCita);

export default router;
