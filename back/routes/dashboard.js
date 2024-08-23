import express from "express";

var router = express.Router();

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

export default router;
