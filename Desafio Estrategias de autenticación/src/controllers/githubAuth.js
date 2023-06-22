import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { userModel } from "../models/Users.js";

passport.use('github',new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        let user = await userModel.findOne({ usernamegithub: profile.username });
        if (!user) {
          let newuser = {
            first_name: profile.username,
            last_name: "",
            email: profile.profileUrl,
            gender: "",
            rol: "usuario",
            usernamegithub: profile.username,
            authenticationType: "github",
          };
let result = await userModel.create(newuser);
          return done(null, result);
        }
        else{
      
          done(null,user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
