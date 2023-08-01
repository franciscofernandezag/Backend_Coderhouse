import mongoose from 'mongoose';
import { logger } from  "./utils/logger.js";

export function connectDatabase() {
  mongoose
    .connect(process.env.URL_MONGODB_ATLAS)
    .then(() => logger.http("DB is connected"))
    .catch((error) => console.log("Error en MongoDB Atlas:", error));
}
