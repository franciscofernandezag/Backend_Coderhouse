import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { userModel } from "./models/Users.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import { engine } from 'express-handlebars'
import { __dirname, __filename } from './path.js'
import * as path from 'path'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import session from 'express-session'

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
  store: MongoStore.create({
      mongoUrl: process.env.URL_MONGODB_ATLAS,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 100 // Medido en segundos
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));


await mongoose.connect(process.env.URL_MONGODB_ATLAS).then(() => console.log("MongoDB conectado"));

// Handlebars 
app.engine(
  'handlebars',engine({
    runtimeOptions: {allowProtoPropertiesByDefault: true,allowProtoMethodsByDefault: true,
    },
    helpers: {eq: function (a, b, options) {
        if (a === b) {return options.fn(this);
        } else {return options.inverse(this);
        }
      },
    },
  })
);
app.set('view engine', 'handlebars') 
app.set('views', path.resolve(__dirname, './views')) 

// Conexion MongoDB
mongoose
  .connect(process.env.URL_MONGODB_ATLAS)
  .then(() => console.log("DB is connected"))
  .catch((error) => console.log("Error en MongoDB Atlas:", error));

// Vista home
app.get('/', (req, res) => {
  res.render('home', { title: 'Página de inicio' });
});



// Ruta POST para el inicio de sesión (LOGIN)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user || user.password !== password) {
      // Usuario o contraseña incorrectos
      return res.render('home', { title: 'Página de inicio', error: 'Correo o contraseña incorrecta' });
    }

    // Inicio de sesión exitoso
    req.session.user = user; // Guarda el usuario en la sesión
    req.session.user.rol = user.rol; // Asigna el valor de 'rol' a la sesion
    res.redirect('/products');
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor' });
  }
});

// Ruta POST para el registro de usuarios// Ruta POST para el registro de usuarios
app.post('/registro', async (req, res) => {
  const { nombre, apellido, email, edad, genero, rol, password } = req.body;
  try {
    if (!nombre || !apellido || !email || !edad || !genero || !rol || !password) {
      // Si falta algún campo, muestra un mensaje de error
      return res.status(400).render('home', { title: 'Página de inicio', error: 'Faltan campos obligatorios' });
    }
    const user = await userModel.create({
      first_name: nombre,
      last_name: apellido,
      email,
      gender: genero,
      rol,
      password
    });
    res.render('home', { title: 'Página de inicio', success: 'Usuario creado exitosamente', error: null });
  } catch (error) {
    console.error('Error en el registro de usuarios:', error);
    res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor', success: null });
  }
});


// Middleware para verificar la autenticación
const authenticate = (req, res, next) => {
  if (req.session.user) {
    // El usuario está autenticado, continuar con la siguiente función de middleware
    next();
  } else {
    // El usuario no está autenticado, redireccionar al inicio de sesión
    res.redirect('/');
  }
};
// Cerrar sesion (LOGOUT)
app.post("/logout", (req, res) => {
  // Eliminar la sesión del usuario
  req.session.destroy();
  // Redireccionar al inicio de sesión
  res.redirect("/");
});

// Routes
app.use('/products', authenticate, productRouter);
app.use('/carts', authenticate, cartRouter);

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});


//LOGIN

  // Prueba 1 -Se crea pagina de login y Registro
            //URL: http://localhost:4000/
            // usuario por defecto "fernandezfco@hotmail.cl" Pass" 123456". 
            // Para probar el registro se solicita crear tu propio usuario e ingresar con el.

  // Prueba 2 - Al ingresar con usuario logeado mostrara vista de los productos
        //URL: http://localhost:4000/products   ( corroborar que sin logearse no se puede acceder directamente a esta ruta)
      
 // Prueba 3 - Se implementa boton de cerrar sesion para "destruir sesion y redirigir al login"

// Prueba 4 - En la vista login se puede filtrar por titulo , ordenar por precio y correr paginas. Se mantiene la configuracion del desafio anterior de un limite 
// de 10 productos por pagina.


// // AGREGO PRIMEROS USUARIOS A MODELO USERS
// await userModel.insertMany([
//     { first_name: "Francisco", last_name: "Fernandez", email: "fernandezfco@hotmail.cl", gender: "Masculino", rol: "Administrador",  password: "123456" },
// ])

