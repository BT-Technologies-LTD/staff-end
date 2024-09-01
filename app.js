import express from "express";
import ejs from "ejs";
import login from "./back/routes/login.js";
import dotenv from "dotenv";
import dashboard from "./back/routes/dashboard.js";
import holidays from "./back/routes/holidays.js";
import tasks from "./back/routes/tasks.js";

dotenv.config();

const app = express();

app.engine("html", ejs.renderFile);

app.set("views", "front");
app.set("view engine", "html");

app.use(express.static("static"));
app.use(express.static("back"));
app.use(express.urlencoded({ extended: true }));
app.use("/", login);
app.use("/", dashboard);
app.use("/", holidays);
app.use("/", tasks);
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
});

app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
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

// General Error-Handling Middleware
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
