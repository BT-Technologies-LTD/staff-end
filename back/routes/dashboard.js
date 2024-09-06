import express from "express";
import NodeCache from "node-cache";
import salary_chart from "../misc/salary_chart.js";

const cache = new NodeCache({ stdTTL: 604800 });
const router = express.Router();

function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "long" });
  const year = d.getFullYear();

  // Function to get the ordinal suffix
  function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const suffix = getOrdinalSuffix(day);
  return `${month} ${day}${suffix} ${year}`;
}

router.get("/dashboard", async (req, res) => {
  try {
    const user = req.session.user;

    const first_name = user.first_name;
    const gender = user.gender;
    const department = user.department;
    const salary = `₦${user.salary}`;
    const salary_chart_data = (() => {
      if (user.salary_data) {
        return salary_chart(user.salary_data);
      }

      return null;
    })();
    const profile_photo_url = user.profile_photo_url;
    const date = new Date();
    const year = date.getFullYear();
    const apiUrl = `https://date.nager.at/api/v3/publicholidays/${year}/NG`;
    let cachedHolidays = cache.get(`holidays_${year}`);
    let nextHoliday = null;
    const salary_data = (() => {
      if (user.salary_data) {
        return user.salary_data;
      }

      return null;
    })();

    if (!cachedHolidays) cachedHolidays = await (await fetch(apiUrl)).json();

    for (const holiday of cachedHolidays) {
      const holidayDate = new Date(holiday.date);

      if (
        holidayDate >= date &&
        (!nextHoliday || holidayDate < new Date(nextHoliday.date))
      ) {
        nextHoliday = { name: holiday.name, date: formatDate(holiday.date) };
      }
    }

    res.render("dashboard", {
      first_name,
      gender,
      department,
      salary,
      salary_chart_data,
      profile_photo_url,
      nextHoliday,
      salary_data,
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
