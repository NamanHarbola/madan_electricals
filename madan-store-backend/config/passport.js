// config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists in our DB
            let user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // If user exists, just pass them through
                return done(null, user);
            } else {
                // If not, create a new user in our DB
                const newUser = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                });
                return done(null, newUser);
            }
        } catch (err) {
            console.error(err);
            return done(err, null);
        }
    }));

    // These are not strictly necessary for JWT-based auth but good practice with passport
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};