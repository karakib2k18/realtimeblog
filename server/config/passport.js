import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export default function configurePassport() {
  // Serialize user
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));

  // Local strategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      return done(null, user);
    })
  );

  // Google OAuth strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOneAndUpdate(
          { googleId: profile.id },
          {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value
          },
          { upsert: true, new: true }
        );
        return done(null, user);
      }
    )
  );
}
