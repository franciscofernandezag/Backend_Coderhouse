import "dotenv/config";
import express from "express";
import session from 'express-session';
import { Server } from 'socket.io'
import { engine } from 'express-handlebars';
import path from 'path';
import passport from './controllers/githubAuth.js';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo'
import { __dirname, __filename } from './path.js'
import { authenticate } from './middlewares.js';
import { connectDatabase } from './database.js';
import { loginUser } from "./controllers/localAuth.js"; 
import { registerUser } from "./controllers/localAuth.js"; 
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import adminRouter from "./routes/admin.routes.js";
import messagesRouter from "./routes/messages.routes.js";
import recoveryRouter from "./routes/recovery.routes.js.js";
import loggerTestRouter from "./routes/logegerTest.routes.js";
import { loggerDev, loggerProd } from  "./utils/logger.js";

const app = express();
const PORT = 4000;

const server = app.listen(PORT, () => {
  loggerDev.http(`Server on port ${PORT}`);
})

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

//ServerIO

const io = new Server(server)
const mensajes = []

io.on('connection', (socket) => {
  loggerDev.http(`Ciente conectado socket IO`);
    socket.on("mensaje", info => {
      console.log(info)
        mensajes.push(info)
        io.emit("mensajes", mensajes) 
    })
})

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
  const userEmail = req.session.user.email; 
  loggerProd.info(`Usuario ${userEmail} ha cerrado sesión.`);
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
app.use('/admin', authenticate, adminRouter);
app.use('/message',authenticate, messagesRouter);
app.use('/chat',authenticate, express.static(__dirname + '/public')) 
app.use('/recovery', recoveryRouter);


//vista chat
app.get("/chat", (req, res) => {
  const cartId = req.session.user.cartId; 
  const userEmail = req.session.user.email; 
  loggerProd.http(`Ciente ${userEmail} acaba de conectarse a chat`);
  res.render('chat', { cartId: cartId }); 
});

// Agregar la ruta de prueba del logger
app.use("/loggerTest", loggerTestRouter);



