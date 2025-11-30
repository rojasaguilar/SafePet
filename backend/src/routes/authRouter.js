import express from 'express';
import authController from '../controllers/authController.js';

//MIDDLEWARES
import {verifyUserToken} from './../middlewares/verifyToken.js';

const router = express.Router();

router.route('/login').post(authController.login);

router.route('/logout').get(verifyUserToken, authController.logOut);

export default router;
