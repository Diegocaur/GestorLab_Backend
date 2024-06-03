import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); //string de coneccion de mongo db
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`Mongo DB conectado en: ${url}`);
  } catch (error) {
    console.log(`error:${error.message}`); //para ver de que trata el error
    process.exit(1); //para forzar que el proceso termine sincrona no espera a otros procesos
  }
};

export default conectarDB;
