import express from "express";

import {
  obtenerProyectos,
  nuevoProyeto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
} from "../controllers/proyectoController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

//ya que es un área privada se debe revisar que se accedio al sistema mediante checkAuth antes de pasar al siguiente middleware
router
  .route("/")
  .get(checkAuth, obtenerProyectos)
  .post(checkAuth, nuevoProyeto);

router
  .route("/:id")
  .get(checkAuth, obtenerProyecto)
  .put(checkAuth, editarProyecto)
  .delete(checkAuth, eliminarProyecto);

//                                 id proyecto

router.post("/colaboradores", checkAuth, buscarColaborador);
router.post("/colaboradores/:id", checkAuth, agregarColaborador);
//se elimina con post dado que delete es para eliminar un recurso completo y con post se puede sacar una parte unicamente
router.post("/eliminar-colaborador/:id", checkAuth, eliminarColaborador);

export default router;
