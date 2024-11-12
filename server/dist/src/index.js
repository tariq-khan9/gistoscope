import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import passport from "./passport/passport.js";
import session from "express-session";
import { typeDefs } from "./schema/typeDefs/index.js";
import { resolvers } from "./schema/resolvers/index.js";
import { router } from "./passport/routes.js";
import resetRouter from "./forgetPass/routes.js";
const app = express();
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true, // Allow cookies or other credentials
};
app.use(cors(corsOptions)); // Use CORS middleware
app.use(express.json());
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});
await apolloServer.start();
app.use("/graphql", expressMiddleware(apolloServer));
app.use(session({
    secret: process.env.SESSION_SECRET || "fallback_secret", // Fallback for development
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // Set cookie to expire after 60 seconds
        secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
    },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", router);
app.use("/reset", resetRouter);
app.listen(4000, () => {
    console.log("Express server running on port 4000");
});
