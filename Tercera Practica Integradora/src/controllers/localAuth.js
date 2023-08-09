import { userModel } from "../models/Users.js";
import cartModel from "../models/Carts.js";
import { comparePasswords, hashPassword } from "../utils/bcryptUtils.js";
import passport from '../utils/passportUtils.js';

export async function loginUser(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error en el inicio de sesión:', err);
      return res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor' });
    }

    if (!user) {
      return res.render('home', { title: 'Página de inicio', error: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Error en el inicio de sesión:', err);
        return res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor' });
      }

      req.session.user = user;
      req.session.user.rol = user.rol;

      // Verificarrol de usuario 
      if (user.rol === 'administrador') {
        return res.redirect('/admin'); 
      } else if (user.rol === 'premium') {
        return res.redirect('/premium'); 
      } else {
        return res.redirect('/products'); 
      }
    });
  })(req, res, next);
}
export async function registerUser(req, res) {
  const { nombre, apellido, email, edad, genero, rol, password } = req.body;
  try {
    if (!nombre || !apellido || !email || !edad || !genero || !rol || !password) {
      return res.status(400).render('home', { title: 'Página de inicio', error: 'Faltan campos obligatorios' });
    }

    // Comprobar si el email ya está en uso
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).render('home', { title: 'Página de inicio', error: 'Email de usuario en uso' });
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

    // Crear un carrito vacío para el usuario
    const cart = await cartModel.create({ products: [] });

    // Asociar el carrito al usuario
    user.cartId = cart._id;
    await user.save();

    res.render('home', { title: 'Página de inicio', success: 'Usuario creado exitosamente', error: null });
  } catch (error) {
    console.error('Error en el registro de usuarios:', error);
    res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor', success: null });
  }
}
