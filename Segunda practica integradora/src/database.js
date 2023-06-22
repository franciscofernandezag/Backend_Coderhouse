import mongoose from 'mongoose';

export function connectDatabase() {
  mongoose
    .connect(process.env.URL_MONGODB_ATLAS)
    .then(() => console.log("DB is connected"))
    .catch((error) => console.log("Error en MongoDB Atlas:", error));
}
