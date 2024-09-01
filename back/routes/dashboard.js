import express from "express";
var router = express.Router();

router.get("/dashboard", async (req, res) => {
  try {
    const data = req.user;

    const first_name = data.name.split(" ")[0];
    const gender = data.gender;
    const dept = data.department;
    const salary = `₦${data.curr_salary.toLocaleString()}`;
    const salary_data = data.salary_data;

    res.render("dashboard", {
      first_name: first_name,
      gender: gender,
      dept: dept,
      salary: salary,
      salary_data: salary_data,
    });
  } catch (error) {
    console.error(error.stack);
    res.status(error.status || 500).render("error", {
      code: error.status || 500,
      desc: error.message || "Internal Server Error",
      message:
        "Our hamsters haven't been given enough food, please try again...",
    });
  }
});

export default router;
