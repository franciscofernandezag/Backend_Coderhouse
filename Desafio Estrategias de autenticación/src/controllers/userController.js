import { userModel } from "../models/Users.js";
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

// Configurar la estrategia de autenticación local
passport.use(new LocalStrategy(
    {
      usernameField: 'email', 
      passwordField: 'password', 
    },
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: 'Correo o contraseña incorrecta' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serializar el usuario
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserializar el usuario
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

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
      res.redirect('/products');
    });
  })(req, res, next);
}

export async function registerUser(req, res) {
  const { nombre, apellido, email, edad, genero, rol, password } = req.body;
  try {
    if (!nombre || !apellido || !email || !edad || !genero || !rol || !password) {
      return res.status(400).render('home', { title: 'Página de inicio', error: 'Faltan campos obligatorios' });
    }

    // Generar el hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      first_name: nombre,
      last_name: apellido,
      email,
      gender: genero,
      rol,
      password: hashedPassword, 
      authenticationType: 'local' // Valor fijo para authenticationType
    });
    res.render('home', { title: 'Página de inicio', success: 'Usuario creado exitosamente', error: null });
  } catch (error) {
    console.error('Error en el registro de usuarios:', error);
    res.status(500).render('home', { title: 'Página de inicio', error: 'Error en el servidor', success: null });
  }
}

