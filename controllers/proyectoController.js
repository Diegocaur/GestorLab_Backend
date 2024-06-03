import Proyecto from "../models/Proyecto.js";

import Usuario from "../models/Usuario.js";

//obtener todos los proyectos del usuario autenticado
const obtenerProyectos = async (req, res) => {
  //req.usuario viene del middleware permite encontrar los proyectos del usuario que inicio sesión
  const proyectos = await Proyecto.find({
    $or: [
      { colaboradores: { $in: req.usuario } },
      { creador: { $in: req.usuario } },
    ],
  }).select("-tareas");
  res.json(proyectos);
};
//para crear nuevos proyectos
const nuevoProyeto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

//para listar un proyecto y las tareas asociadas a el
const obtenerProyecto = async (req, res) => {
  const { id } = req.params; //tiene routing dinamico

  //consultar base de datos para ver si el proyecto existe
  const proyecto = await Proyecto.findById(id)
    .populate({
      path: "tareas",
      populate: { path: "completado", select: "nombre" },
    })
    .populate("colaboradores", "nombre email");

  //si no existe returnar error
  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  //Mostrar proyecto sólo si eres quién creo el proyecto
  //se pasa a string para realizar comparación estricta
  if (
    proyecto.creador.toString() !== req.usuario._id.toString() &&
    !proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Acción No Válida");
    return res.status(401).json({ msg: error.message });
  }

  res.json(proyecto);
  //Obtener las tareas del proyecto
};

//para editar nombres o fechas etc
const editarProyecto = async (req, res) => {
  const { id } = req.params; //tiene routing dinamico

  //consultar base de datos para ver si el proyecto existe
  const proyecto = await Proyecto.findById(id);

  //si no existe returnar error
  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  //Mostrar proyecto sólo si eres quién creo el proyecto
  //se pasa a string para realizar comparación estricta
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos");
    return res.status(401).json({ msg: error.message });
  }
  //si se ingresa algo actualiza eso y si no se mantiene lo del servidor
  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params; //tiene routing dinamico

  //consultar base de datos para ver si el proyecto existe
  const proyecto = await Proyecto.findById(id);

  //si no existe returnar error
  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  //Mostrar proyecto sólo si eres quién creo el proyecto
  //se pasa a string para realizar comparación estricta
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await proyecto.deleteOne();
    res.json({ msg: "Proyecto Eliminado" });
  } catch (error) {
    console.log(error);
  }
};

const buscarColaborador = async (req, res) => {
  const { email } = req.body;

  //revisar si el usuario esta registrado
  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v"
  );
  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }
  res.json(usuario);
};
const agregarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);

  if (!proyecto) {
    const error = new Error("Proyecto No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v "
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // El colaborador no es el admin del proyecto
  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error("El Creador del Proyecto no puede ser colaborador");
    return res.status(404).json({ msg: error.message });
  }

  // Revisar que no este ya agregado al proyecto
  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error("El Usuario ya pertenece al Proyecto");
    return res.status(404).json({ msg: error.message });
  }

  // Esta bien, se puede agregar
  proyecto.colaboradores.push(usuario._id);
  await proyecto.save();
  res.json({ msg: "Colaborador Agregado Correctamente" });
};
const eliminarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);

  if (!proyecto) {
    const error = new Error("Proyecto No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  // Esta bien, se puede eliminar
  proyecto.colaboradores.pull(req.body.id);
  await proyecto.save();
  res.json({ msg: "Colaborador Eliminado Correctamente" });
};

export {
  obtenerProyectos,
  nuevoProyeto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
};
