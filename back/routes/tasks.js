import express from "express";
import tasksCalculation from "../misc/tasks-calculation.js";

var router = express.Router();

// Iterate over each year

router.get("/tasks", async (req, res) => {
  try {
    const tasks_data = req.user.tasks_data;
    const tasks_calculated_data = tasksCalculation(req.user.tasks_data);
    const years = Object.keys(tasks_data).sort((a, b) => b - a);

    res.render("tasks", {
      completed_tasks: tasks_calculated_data.completed_tasks,
      percentage_increase: tasks_calculated_data.percentageIncrease,
      is_positive: tasks_calculated_data.is_positive,
      completion_percentage: tasks_calculated_data.completion_percentage,
      not_completed_tasks: tasks_calculated_data.not_completed_tasks,
      days: tasks_calculated_data.days,
      hours: tasks_calculated_data.hours,
      minutes: tasks_calculated_data.minutes,
      seconds: tasks_calculated_data.seconds,
      tasks_data: tasks_data,
      years: years,
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
