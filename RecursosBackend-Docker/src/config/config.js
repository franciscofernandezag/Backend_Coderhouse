import dotenv from 'dotenv';
dotenv.config();

// Define la configuración con las variables de entorno
const config = {
  mongo: {
    URL: process.env.MONGO_URL || 'mongodb://localhost:27017'
  }
};

export default config;


