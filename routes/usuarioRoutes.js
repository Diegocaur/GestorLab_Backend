import express from "express";

const router = express.Router();

import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  obtenerUsuarios,
} from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";

// autenticación registro y confirmación de usuarios

//registrar usuarios
router.post("/", registrar); //crea un nuevo usuario
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:token", comprobarToken);
router.post("/olvide-password/:token", nuevoPassword);

//función de express para soportar diferentes peticiones a una misma url
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

//para comprobar el usuario en el check auth si todo es correcto pasa al perfil
router.get("/perfil", checkAuth, perfil);
router.get("/perfil-usuarios", checkAuth, obtenerUsuarios);

export default router;
