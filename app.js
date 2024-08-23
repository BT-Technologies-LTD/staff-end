import express from "express";
import ejs from "ejs";
import login from "./back/routes/login.js";
import dotenv from "dotenv";
import dashboard from "./back/routes/dashboard.js";

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
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
