import dotenv from "dotenv";
dotenv.config();
import prisma from "../../prisma/prismaClient.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy } from "passport-local";
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
}, async function (accessToken, refreshToken, profile, done) {
    try {
        const email = profile && profile.emails[0].value;
        const name = profile.displayName;
        const image = profile.photos && profile.photos[0].value;
        if (!email) {
            return done(new Error("No email found in Google profile"), null);
        }
        let user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            // If user does not exist, create a new record in the database
            user = await prisma.user.create({
                data: {
                    email: email,
                    authType: "google",
                    name: name,
                    image: image,
                },
            });
        }
        // Attach the user ID to the profile object to be used in the session
        const userWithId = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            authType: user.authType,
        };
        return done(null, userWithId);
    }
    catch (error) {
        return done(error, null);
    }
}));
passport.use(new Strategy({ usernameField: "email" }, async function (email, password, done) {
    console.log(email, password);
    try {
        // Find the user in the PostgreSQL database using Prisma
        const user = await prisma.user.findUnique({
            where: { email },
        });
        // If no user is found, return an error
        if (!user) {
            return done(null, false, { message: "Incorrect username." });
        }
        if (user.password !== password) {
            return done(null, false, { message: "Incorrect password." });
        }
        // If everything is okay, return the user object
        return done(null, user);
    }
    catch (err) {
        // Handle any errors that occur during authentication
        return done(err);
    }
}));
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
export default passport;
