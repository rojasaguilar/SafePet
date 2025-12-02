import express from 'express';

import citasController from '../controllers/citasController.js';

// import { getQueryParams } from '../middlewares/queryObjectCitas.js';
// import { verifyUserToken } from '../middlewares/verifyToken.js';

// const router = express.Router({ mergeParams: true });
const router = express.Router();

router
  .route('/')
  //MIDDLEWARE PARA VER TOKEN, PERO FALTA ADECUARLO PORQUE SE TINENE QUE MANDAR POR HEADER
  // .get(verifyUserToken, getQueryParams, citasController.getCitas)
  .get(citasController.getCitas)
  .post(citasController.addCita);

router
  .route('/:id')
  .get(citasController.getCita)
  .patch(citasController.updateCita)
  .delete(citasController.deleteCita);

export default router;
