
import multer from 'multer';
import path from 'path';


// Rutas de destino
const profilesUploadPath = path.join(__dirname, 'src', 'public', 'profiles');
const productsUploadPath = path.join(__dirname, 'src', 'public', 'products');

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';

    if (file.fieldname === 'profileImage') {
      uploadPath = profilesUploadPath;
    } else if (file.fieldname === 'productImage') {
      uploadPath = productsUploadPath;
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

// Configurar Multer con la configuración de almacenamiento y filtro
const upload = multer({ storage: storage });

// Middleware para manejar la carga de archivos
const uploadMiddleware = (req, res, next) => {
  const fieldName = req.body.fieldName; // Reemplaza 'fieldName' con el nombre del campo de tu formulario
  const uploadHandler = upload.single(fieldName); // Utiliza 'fieldName' para identificar el campo correcto

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Error de Multer (p. ej., archivo demasiado grande)
      res.status(400).json({ error: 'Error de carga de archivo: ' + err.message });
    } else if (err) {
      // Otro tipo de error
      res.status(500).json({ error: 'Ocurrió un error durante la carga del archivo' });
    } else {
      // Carga de archivo exitosa
      next(); // Continuar con la siguiente ruta/middleware
    }
  });
};

export default uploadMiddleware;