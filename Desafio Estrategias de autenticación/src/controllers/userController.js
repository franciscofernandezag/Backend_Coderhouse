import { userModel } from "../models/Users.js";

export async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user || user.password !== password) {
      return res.render('home', { title: 'Página de inicio', error: 'Correo o contraseña incorrecta' });
    }

    req.session.user = user;
    req.session.user.rol = user.rol;
    res.redirect('/products');
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor' });
  }
}

export async function registerUser(req, res) {
  const { nombre, apellido, email, edad, genero, rol, password } = req.body;
  try {
    if (!nombre || !apellido || !email || !edad || !genero || !rol || !password) {
      return res.status(400).render('home', { title: 'Página de inicio', error: 'Faltan campos obligatorios' });
    }
    const user = await userModel.create({
      first_name: nombre,
      last_name: apellido,
      email,
      gender: genero,
      rol,
      password,
      authenticationType: 'local' // Agregar el campo authenticationType con valor "local"
    });
    res.render('home', { title: 'Página de inicio', success: 'Usuario creado exitosamente', error: null });
  } catch (error) {
    console.error('Error en el registro de usuarios:', error);
    res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor', success: null });
  }
}
