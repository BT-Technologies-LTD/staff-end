import express from "express";
import tasksCalculation from "../misc/tasks-calculation.js";

const router = express.Router();

router.get("/tasks", async (req, res) => {
  try {
    const { tasks_data } = req.session.user;

    const tasks = (() => {
      if (tasks_data) {
        return tasksCalculation(tasks_data);
      }
      return null;
    })();

    const years = (() => {
      if (tasks) {
        return Object.keys(tasks).sort((a, b) => b - a);
      }
      return null;
    })();

    const {
      completed_tasks,
      percentageIncrease,
      is_positive,
      completion_percentage,
      not_completed_tasks,
      days,
      hours,
      minutes,
      seconds,
    } = (() => {
      if (tasks) {
        return {
          completed_tasks: tasks.completed_tasks,
          percentageIncrease: tasks.percentageIncrease,
          is_positive: tasks.is_positive,
          completion_percentage: tasks.completion_percentage,
          not_completed_tasks: tasks.not_completed_tasks,
          days: tasks.days,
          hours: tasks.hours,
          minutes: tasks.minutes,
          seconds: tasks.seconds,
        };
      }

      return {
        completed_tasks: null,
        percentageIncrease: null,
        is_positive: null,
        completion_percentage: null,
        not_completed_tasks: null,
        days: null,
        hours: null,
        minutes: null,
        seconds: null,
      };
    })();

    res.render("tasks", {
      completed_tasks,
      percentage_increase: percentageIncrease,
      is_positive,
      completion_percentage,
      not_completed_tasks,
      days,
      hours,
      minutes,
      seconds,
      tasks,
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
