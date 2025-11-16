import express from "express";
import morgan from "morgan";
import dotenv_conf from "./config/dotenv_conf.js";

//ROUTERS
import mascotasRouter from './routes/mascotasRoutes.js';
import usuariosRouter from './routes/usuariosRoutes.js';

const app = express();

//MIDDLEWARES GENERALES
app.use(express.json());
app.use(morgan("dev"));


//URL BASE
const API_URL_BASE = dotenv_conf.API_URL_BASE;

//
app.get(`/`, (req, res) => {
  return res.send(
    `<h1>RESTful running in root</h1>`
  );
});

// 2) MIDDLEWARE FOR SPECIFIC ROUTES (MY ROUTERS)
app.use(`${API_URL_BASE}/mascota`, mascotasRouter);
app.use(`${API_URL_BASE}/usuario`, usuariosRouter);

export default app;
