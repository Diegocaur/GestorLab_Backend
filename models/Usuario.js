import mongoose from "mongoose";
import bcrypt from "bcrypt";
//definit schema que es la estructura de la base de datos
const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true, //eliminar espacios en blanco antes y despues
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, //el email es unico
    },
    token: {
      type: String,
    },
    //para confirmar emails
    confirmado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, //crea dos columnas creado/actualizado
  }
);

usuarioSchema.pre("save", async function (next) {
  //se usa mongoose para comprobar que si no se esta modificando el password no se haga nada por lo tanto haga un next y siga las etapas . exprees tiene el next que permite contiunar hacia el siguiente middelware
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//se compara con bcrypt si lo ingresado coincide con el password hasheado
usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
