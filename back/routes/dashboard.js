import express from "express";

var router = express.Router();

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;
