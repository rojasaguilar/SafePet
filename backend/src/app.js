import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv_conf from './config/dotenv_conf.js';

//ROUTERS
import mascotasRouter from './routes/mascotasRoutes.js';
import usuariosRouter from './routes/usuariosRoutes.js';
import clinicasRouter from './routes/clinicasRouter.js';
import citasRouter from './routes/citasRouter.js';
import authRouter from './routes/authRouter.js';
import especialidadesRouter from './routes/especialidadesRouter.js';

const app = express();

//MIDDLEWARES GENERALES
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

//URL BASE
const API_URL_BASE = dotenv_conf.API_URL_BASE;

//
app.get(`/`, (req, res) => {
  return res.send(`<h1>RESTful running in root</h1>`);
});

// 2) MIDDLEWARE FOR SPECIFIC ROUTES (MY ROUTERS)
app.use(`${API_URL_BASE}/mascotas`, mascotasRouter);
app.use(`${API_URL_BASE}/usuarios`, usuariosRouter);
app.use(`${API_URL_BASE}/clinicas`, clinicasRouter);
app.use(`${API_URL_BASE}/citas`, citasRouter);
app.use(`${API_URL_BASE}/auth`, authRouter);
app.use(`${API_URL_BASE}/especialidades`, especialidadesRouter);

export default app;
