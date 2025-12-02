import { Router } from 'express';

import especialidadesController from '../controllers/especialidadesController.js';

const router = Router();

router.route('/').get(especialidadesController.getEspecialidades);

export default router;
