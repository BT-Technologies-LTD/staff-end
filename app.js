import express from "express";
import ejs from "ejs";
import login from "./back/routes/login.js";
import dotenv from "dotenv";
import dashboard from "./back/routes/dashboard.js";
import tasks from "./back/routes/tasks.js";
import payroll from "./back/routes/payroll.js";
import register from "./back/routes/register.js";
import session from "express-session";
import generatePayslip from "./back/routes/generate_payslip.js";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import { doc, getDoc } from "firebase/firestore";

dotenv.config();

const cookie_age = 1 * 24 * 60 * 60 * 1000;
const REFRESH_INTERVAL = 1000 * 60 * 30; // 30 minutes

const app = express();

app.engine("html", ejs.renderFile);

app.set("views", "front");
app.set("view engine", "html");

app.use(express.static("static"));
app.use(express.static("back"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: cookie_age, httpOnly: true }, // change to true when uploading
  })
);
app.use(flash());
app.use(async (req, res, next) => {
  try {
    res.locals.messages = req.flash();

    if (
      req.path === "/" ||
      req.path === "/register" ||
      req.path === "/signin"
    ) {
      return next();
    } else {
      if (req.session.user) {
        req.session.cookie.maxAge = cookie_age;
        const now = Date.now();
        const lastUpdate = req.session.user.lastUpdate || 0;

        if (now - lastUpdate > REFRESH_INTERVAL) {
          const staffDocRef = doc(db, "staff_list", req.session.user.uid);
          const staffDoc = await getDoc(staffDocRef);

          if (staffDoc.exists()) {
            req.session.user = {
              uid: req.session.user.uid,
              ...staffDoc.data(),
              lastUpdate: now, // Update timestamp of last update
            };
          }
        }

        return next();
      } else {
        req.flash("error", "You need to log in.");
        res.redirect("/");
      }
    }
  } catch (error) {}
});
app.use("/", register);
app.use("/", login);
app.use("/", dashboard);
app.use("/", tasks);
app.use("/", payroll);
app.use("/", generatePayslip);

app.post("/logout", function (req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/dashboard");
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

app.use((req, res, next) => {
  res.status(404).render("error", {
    code: 404,
    desc: "Page not found",
    message: "You probably shouldn't be here 👀",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("error", {
    code: err.status || 500,
    desc: err.message || "Internal Server Error",
    message: "Our hamsters haven't been given enough food, please try again...",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
