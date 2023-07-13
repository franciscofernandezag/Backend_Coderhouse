import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { userModel } from '../models/Users.js';

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
));

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

export default passport;
