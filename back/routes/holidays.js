import express from "express";
import axios from "axios";
import NodeCache from "node-cache";

var router = express.Router();
const cache = new NodeCache({ stdTTL: 604800 }); // 1 week in seconds

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

router.get("/holidays", async (req, res) => {
  const year = new Date().getFullYear(); // Use current year dynamically
  const apiUrl = `https://date.nager.at/api/v3/publicholidays/${year}/NG`;

  // Check cache first
  const cachedHolidays = cache.get(`holidays_${year}`);

  if (cachedHolidays) {
    // Cached data found, render using cached data
    res.render("holidays", {
      holidays: cachedHolidays,
      formatDate: formatDate,
    });
  } else {
    try {
      const response = await axios.get(apiUrl);
      const holidays = response.data;

      // Cache the result
      cache.set(`holidays_${year}`, holidays);

      res.render("holidays", { holidays: holidays, formatDate: formatDate });
    } catch (e) {
      console.error("Error fetching holidays:", e);
      res.status(500).send("Error fetching holidays");
    }
  }
});

export default router;
