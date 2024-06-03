import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const agregarTarea = async (req, res) => {
  //verificar que el proyecto existe
  const { proyecto } = req.body;
  const existeProyecto = await Proyecto.findById(proyecto);
  if (!existeProyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }
  //comprobar que persona que agrega tarea creo el proyecto compara autenticacion con creador del proyecto
  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Permisos Invalidos");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const tareaAlmacenada = await Tarea.create(req.body);
    //almacenar id en proyecto
    existeProyecto.tareas.push(tareaAlmacenada._id);
    await existeProyecto.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};
const obtenerTarea = async (req, res) => {
  //identificar id
  const { id } = req.params;
  //identificar tarea
  //                                     Para cruzar información de la tarea con el proyecto asociado para poder comprobar información del creador
  const tarea = await Tarea.findById(id).populate("proyecto");
  if (!tarea) {
    const error = new Error("Tarea No existente");
    return res.status(404).json({ msg: error.message });
  }
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción Invalida");
    return res.status(403).json({ msg: error.message });
  }
  res.json(tarea);
};
const actualizarTarea = async (req, res) => {
  //identificar id
  const { id } = req.params;
  //identificar tarea
  //                                     Para cruzar información de la tarea con el proyecto asociado para poder comprobar información del creador
  const tarea = await Tarea.findById(id).populate("proyecto");
  if (!tarea) {
    const error = new Error("Tarea No existente");
    return res.status(404).json({ msg: error.message });
  }
  //verificación de permisos
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción Invalida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.nombre = req.body.nombre || tarea.nombre;
  tarea.descripcion = req.body.descripcion || tarea.descripcion;
  tarea.prioridad = req.body.prioridad || tarea.prioridad;
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;
  try {
    const tareaAlmacenada = await tarea.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};
const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const proyecto = await Proyecto.findById(tarea.proyecto);
    proyecto.tareas.pull(tarea._id);
    await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);
    res.json({ msg: "La Tarea se eliminó" });
  } catch (error) {
    console.log(error);
  }
};

const cambiarEstado = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (
    tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
    !tarea.proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.estado = !tarea.estado;
  tarea.completado = req.usuario._id;
  await tarea.save();

  const tareaAlmacenada = await Tarea.findById(id)
    .populate("proyecto")
    .populate("completado");

  res.json(tareaAlmacenada);
};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};
