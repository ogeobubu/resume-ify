import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from './models/User.js';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }
    existingUser = await User.findOne({ email: profile.emails[0].value });
    if (existingUser) {
      existingUser.googleId = profile.id;
      await existingUser.save();
      return done(null, existingUser);
    }
    const newUser = await new User({
      googleId: profile.id,
      fullName: profile.displayName,
      email: profile.emails[0].value,
    }).save();
    
    done(null, newUser);
  } catch (error) {
    console.error("Error during Google authentication:", error);
    done(error, null);
  }
}));
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});