import { userModel } from "../models/Users.js";
import cartModel from "../models/Carts.js";
import { comparePasswords, hashPassword } from "../utils/bcryptUtils.js";
import passport from '../utils/passportUtils.js';
import { loggerDev, loggerProd } from  "../utils/logger.js";

export async function loginUser(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      loggerProd.fatal("Error en el servidor al intentar iniciar sesion local");
      return res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor' });
    }

    if (!user) {
      loggerProd.info(`Intento de inicio de sesión local fallido para el usuario: ${req.body.email}`);
      return res.render('home', { title: 'Página de inicio', error: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        loggerProd.fatal("Error en el servidor al intentar iniciar sesion local");
        return res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor' });
      }

      req.session.user = user;
      req.session.user.rol = user.rol;

      // Verificar si el usuario tiene rol de administrador
      if (user.rol === 'administrador') {
        loggerProd.info(`Inicio de sesión exitoso para el usuario Administrador: ${user.email}`);
        return res.redirect('/admin'); // Redirigir a la ruta /admin para usuarios administradores
      } else {
        loggerProd.info(`Inicio de sesión exitoso para el usuario: ${user.email}`);
        return res.redirect('/products'); // Redirigir a la ruta /products para usuarios no administradores
      }
    });
  })(req, res, next);
}


export async function registerUser(req, res) {
  const { nombre, apellido, email, edad, genero, rol, password } = req.body;
  try {
    if (!nombre || !apellido || !email || !edad || !genero || !rol || !password) {
      logger.warning(`Faltan campos obligatorios para el registro local de usuario: ${JSON.stringify(req.body)}`);
      return res.status(400).render('home', { title: 'Página de inicio', error: 'Faltan campos obligatorios' });
    }

    // Comprobar si el email ya está en uso
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      loggerProd.warning(`Email de usuario ya existe: ${req.body.email}`);
      return res.status(400).render('home', { title: 'Página de inicio', error: 'Email de usuario ya existe' });
    }

    // Generar el hash de la contraseña
    const hashedPassword = await hashPassword(password);

    const user = await userModel.create({
      first_name: nombre,
      last_name: apellido,
      email,
      gender: genero,
      rol,
      password: hashedPassword,
      authenticationType: 'local'
    });
    logger.info(`Nuevo usuario creado: ${user}`);

    // Crear un carrito vacío para el usuario
    const cart = await cartModel.create({ products: [] });
    loggerProd.info(`ID de Nuevo carrito asociado a usuario creado: ${user.cartId}`);


    // Asociar el carrito al usuario
    user.cartId = cart._id;
    await user.save();

    res.render('home', { title: 'Página de inicio', success: 'Usuario creado exitosamente', error: null });
  } catch (error) {
    loggerProd.fatal("Error en el registro de usuarios");
    res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor', success: null });
  }
}
