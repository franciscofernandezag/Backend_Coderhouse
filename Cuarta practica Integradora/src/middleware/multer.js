import multer from 'multer';
import path from 'path';
import { __dirname, __filename } from '../../src/path.js' 

// Carpeta de destino para imágenes de productos
const productsUploadPath = path.join(__dirname, 'public', 'documents', 'product');

// Carpeta de destino para imágenes de perfiles de usuarios
const profilesUploadPath = path.join(__dirname, 'public', 'documents', 'profiles');

// Configuración de almacenamiento de Multer para productos
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsUploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

// Configuración de almacenamiento de Multer para perfiles de usuarios
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilesUploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

// Configurar Multer para productos
const productUpload = multer({ storage: productStorage });

// Configurar Multer para perfiles de usuarios
const profileUpload = multer({ storage: profileStorage });

// Middleware para manejar la carga de archivos de productos
const productUploadMiddleware = (req, res, next) => {
  const uploadHandler = productUpload.single('productImage');
  
  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: 'Error de carga de archivo: ' + err.message });
    } else if (err) {
      res.status(500).json({ error: 'Ocurrió un error durante la carga del archivo' });
    } else {
      next();
    }
  });
};

// Middleware para manejar la carga de archivos de perfiles de usuarios
const profileUploadMiddleware = (req, res, next) => {
  const uploadHandler = profileUpload.single('profileImage');
  
  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: 'Error de carga de archivo: ' + err.message });
    } else if (err) {
      res.status(500).json({ error: 'Ocurrió un error durante la carga del archivo' });
    } else {
      next();
    }
  });
};

export { productUploadMiddleware, profileUploadMiddleware };
