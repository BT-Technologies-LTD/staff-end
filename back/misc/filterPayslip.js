export default function (
  payslip_data,
  from_year,
  from_month,
  to_year,
  to_month
) {
  // Month names array for converting from month name to index
  const monthsOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Convert from and to month names to their respective index
  const fromMonthIndex = monthsOrder.indexOf(from_month);
  const toMonthIndex = monthsOrder.indexOf(to_month);

  let filteredData = {};

  Object.keys(payslip_data).forEach((year) => {
    const currentYear = parseInt(year);
    const fromYearNum = parseInt(from_year);
    const toYearNum = parseInt(to_year);

    // Skip years outside the range
    if (currentYear < fromYearNum || currentYear > toYearNum) {
      return;
    }

    filteredData[year] = {};

    const monthsInYear = Object.keys(payslip_data[year]);

    monthsInYear.forEach((month) => {
      const currentMonthIndex = parseInt(month); // Month is a number in payslip_data

      // Skip months outside the range within the same year
      if (
        (currentYear === fromYearNum && currentMonthIndex < fromMonthIndex) ||
        (currentYear === toYearNum && currentMonthIndex > toMonthIndex)
      ) {
        return;
      }

      // Include the month if it's within the valid range
      filteredData[year][currentMonthIndex] =
        payslip_data[year][currentMonthIndex];
    });

    // Remove year if it has no valid months
    if (Object.keys(filteredData[year]).length === 0) {
      delete filteredData[year];
    }
  });

  return filteredData;
}
