import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { userModel } from "../models/Users.js";

passport.use(
new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ usernamegithub: profile.username });

        if (user) {
          return done(null, user);
        } else {
          user = await userModel.create({
            first_name: profile.displayName.split(" ")[0],
            last_name: profile.displayName.split(" ")[1] || "",
            email: "",
            gender: "",
            rol: "",
            usernamegithub: profile.username,
            password: "",
            authenticationType: "github",
          });

          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
