import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

//codigo para crear un usuario y almacenarlo en la base de datos
const registrar = async (req, res) => {
  //evitar usuarios duplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });
  //findOne es un método de mongoose que permite encontrar el primero que coincide con el email
  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    await usuario.save();

    //enviar email de confirmación
    emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });
    res.json({
      msg: "Usuario Creado Correctamente, Revisa Tu Email Para Confirmar Tu Cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  //comprobar existencia de usuario
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  //comprobar usuario confirmado

  if (!usuario.confirmado) {
    const error = new Error("La cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }
  //comprobar su password utiliza funcion en modelo usuario
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("El Token no es valido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = ""; //dado que el token es de un solo uso
    await usuarioConfirmar.save(); //para guardar en la base de datos con los cambios
    res.json({ msg: "usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();
    //enviar mail con instrucciones
    emailOlvidePassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    res.json({ msg: "se ha enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};
//params para extraer de url
//body para extraer de formulario
const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });
  if (tokenValido) {
    res.json({ msg: "Token Valido-Usuario Existe" });
  } else {
    const error = new Error("Token Invalido");
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  //comprobar validez de token
  const usuario = await Usuario.findOne({ token });
  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      res.json({ msg: "password actualizada" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token Invalido");
    return res.status(404).json({ msg: error.message });
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
};

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  obtenerUsuarios,
};
