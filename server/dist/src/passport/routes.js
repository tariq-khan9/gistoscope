import { Router } from "express";
import passport from "passport";
export const router = Router();
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL, //process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
}));
router.post("/login-local", passport.authenticate("local"), (req, res) => {
    console.log("Request received at /login-local");
    res.status(200).json({
        success: true,
        message: "Login successful",
        user: req.user,
    });
});
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "login failed",
    });
});
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "user logged in successfully",
            user: req.user,
            // cookies: req.cookies,
        });
    }
});
// router.post("/login-local", (req, res) => {
//   if (req.user) {
//     res.status(200).json({
//       success: true,
//       message: "user logged in successfully",
//       user: req.user,
//       // cookies: req.cookies,
//     });
//   }
// });
router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
        // Clear any session cookies here if needed
        res.clearCookie("connect.sid"); // Clear the session cookie if you're using "connect.sid"
        // Respond with JSON instead of redirecting
        res.status(200).json({ message: "Logout successful" });
    });
});
router.get("/session", (req, res) => {
    if (req.isAuthenticated()) {
        // If the user is authenticated, return user info
        res.json({ user: req.user });
    }
    else {
        // If not authenticated, return null or a message
        res.status(401).json({ user: null, message: "Not authenticated" });
    }
});
