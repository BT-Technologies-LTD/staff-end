import express from "express";

const router = express.Router();

router.get("/payroll", async (req, res) => {
  res.render("payroll");
});
export default router;
