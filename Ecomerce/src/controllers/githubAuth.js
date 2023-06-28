import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { userModel } from "../models/Users.js";
import cartModel from "../models/Carts.js";

passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log(profile);
        let user = await userModel.findOne({ email: profile._json.email });
        if (!user) {
          let newuser = {
            first_name: profile.username,
            last_name: "",
            email: profile._json.email,
            gender: "",
            rol: "usuario",
            usernamegithub: profile.username,
            password: "",
            authenticationType: "github",
          };
          let result = await userModel.create(newuser);

          // Crear carrito para el usuario
          try {
            const cart = await cartModel.create({ products: [] });
            result.cartId = cart._id; 
            await result.save();
          } catch (error) {
            console.error('Error al crear el carrito:', error);
          }

          return done(null, result);
        } else {
          // Verificar si el usuario tiene un carrito asociado
          if (!user.cart) {
            try {
              const cart = await cartModel.create({ products: [] });
              user.cartId = cart._id;
              await user.save();
            } catch (error) {
              console.error('Error al crear el carrito:', error);
            }
          }

          done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
