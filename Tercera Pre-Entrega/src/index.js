import "dotenv/config";
import express from "express";
import { engine } from 'express-handlebars';
import path from 'path';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo'
import session from 'express-session';

import { __dirname, __filename } from './path.js'
import { authenticate } from './middlewares.js';
import { connectDatabase } from './database.js';
import { loginUser } from "./controllers/localAuth.js"; 
import { registerUser } from "./controllers/localAuth.js"; 
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import adminRouter from "./routes/admin.routes.js";
import passport from './controllers/githubAuth.js';

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE));
app.use(session({
  store: MongoStore.create({
      mongoUrl: process.env.URL_MONGODB_ATLAS,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 500 // Medido en segundos
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));;

// Handlebars
app.engine(
  'handlebars',
  engine({
    partialsDir: path.resolve(__dirname, 'views'),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    },
    helpers: {
      eq: function (a, b, options) {
        if (a === b) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      }
    }
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, 'views'));

// Conexion MongoDB
connectDatabase();

// Vista home
app.get('/', (req, res) => {
  res.render('home', { title: 'Página de inicio' });
});

// Ruta POST para el inicio de sesión
app.post('/login', loginUser);

// Ruta POST para el registro de usuarios
app.post('/registro', registerUser);

// Cerrar sesion (LOGOUT)
app.get("/logout", (req, res) => {
  // Eliminar la sesión del usuario
  req.session.destroy();
  // Redireccionar al inicio de sesión
  res.redirect("/");
});

// Configurar las rutas de autenticación de GitHub
app.get('/auth/github', passport.authenticate('github', { scope: ['user:usernamegithub'] }));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
  }
);

// Rutas
app.use('/products', authenticate, productRouter);
app.use('/carts', authenticate, cartRouter);
app.use('/products', authenticate, adminRouter);

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

