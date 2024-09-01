import express from "express";
import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";
import session from "express-session";
import dotenv from "dotenv";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import sample from "../data/sample.js";

dotenv.config();

var router = express.Router();
const data_list = sample;

router.use(cookieParser());
router.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // change to true when uploading
  })
);
router.use(passport.session());
router.use(flash());
router.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

passport.use(
  new CustomStrategy(async function (req, done) {
    const staffID = req.body.username;

    const staffMember = data_list.find((member) => member.staff_id === staffID);

    // Replace this with your actual verification logic
    if (staffMember) {
      return done(null, staffMember);
    } else {
      return done(null, false, { message: "Invalid Staff ID" });
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.staff_id);
});

passport.deserializeUser((id, done) => {
  // Fetch user from database or other source
  const staffMember = data_list.find((member) => member.staff_id === id);

  done(null, staffMember);
});

router.use((req, res, next) => {
  if (req.path === "/" || req.path === "/login") {
    return next();
  }

  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
});

router.get("/", (req, res) => {
  const message = res.locals.messages.error ?? null;
  const data = {
    message: message,
  };
  res.render("login", data);
});

router.post(
  "/login",
  passport.authenticate("custom", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true,
  })
);

export default router;
