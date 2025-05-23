// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import bcrypt from 'bcryptjs';
// import User from '../models/User.js';

// export default function configurePassport() {
//   // Local login strategy
//   passport.use(
//     new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
//       try {
//         const user = await User.findOne({ email });
//         if (!user || !user.password) return done(null, false, { message: 'Invalid credentials' });

//         const match = await bcrypt.compare(password, user.password);
//         if (!match) return done(null, false, { message: 'Incorrect password' });

//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     })
//   );

//   // Google OAuth strategy
//   passport.use(
//     new GoogleStrategy({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: '/api/auth/google/callback'
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           user = new User({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             profilePic: profile.photos[0].value
//           });
//           await user.save();
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     })
//   );

//   passport.serializeUser((user, done) => {
//     done(null, user._id);
//   });

//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await User.findById(id);
//       done(null, user);
//     } catch (err) {
//       done(err);
//     }
//   });
// }


import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export default function configurePassport() {
  // ✅ Local Strategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user || !user.password) return done(null, false, { message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Incorrect password' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // ✅ Google Strategy with duplicate email check
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Check for existing email first
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              // Link existing account to Google
              user.googleId = profile.id;
              user.image = profile.photos[0]?.value;
              await user.save();
            } else {
              // Create new user
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0]?.value,
              });
            }
          }

          return done(null, user);
        } catch (err) {
          console.error('🔴 Google login error:', err);
          return done(err);
        }
      }
    )
  );

  // ✅ Session handling
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
