import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js"; //los archivos creados llevan .js
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";

const app = express();
app.use(express.json()); // habilita que se pueda leer la información que entra en formato json,que se pueda procesar de forma adecuada
dotenv.config(); //con esto busca el archivo env

conectarDB();

//configuracion de CORS

const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    //console.log(origin);
    if (whitelist.includes(origin)) {
      //si puede consultar api
      callback(null, true);
    } else {
      //no se permite
      callback(new Error("Error de Cors"));
    }
  },
};

app.use(cors(corsOptions));

//Postman
//app.use(cors());
//Routing: agrupar rutas para usuarios proyectos tareas separadas y asociadas a diferentes controladores para mejorar el orden
//verbo,endpoint,req lo que envias res la respuesta en express
//use responde a todas las peticiones http

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor Corriendo en el puerto ${PORT}`);
});
