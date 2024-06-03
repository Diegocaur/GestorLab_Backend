import mongoose from "mongoose";

const proyectoSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
      required: true,
    },
    fechaEntrega: {
      type: Date,
      default: Date.now(),
    },
    cliente: {
      type: String,
      trim: true,
      required: true,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId, //para relacionar los proyectos con el usuario que los crea
      ref: "Usuario",
    },
    tareas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tarea",
      },
    ],
    colaboradores: [
      //corchetes para indicar que puede existir más de uno
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
  },
  {
    timestamps: true, //para columnas createdAt y updateAt
  }
);

const Proyecto = mongoose.model("Proyecto", proyectoSchema);

export default Proyecto;
