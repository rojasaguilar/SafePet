import express from 'express';

import citasController from '../controllers/citasController.js';

const router = express.Router();

router.route('/').get(citasController.getCitas).post(citasController.addCita);

export default router;
