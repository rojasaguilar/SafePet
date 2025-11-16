import express from "express";

const router = express.Router();

router.route("/").get((req, res) => {
  return res.send("<h1>Hello from route mascotas </h1>");
});

export default router;
