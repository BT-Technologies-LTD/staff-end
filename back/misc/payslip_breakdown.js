export default function payslipBreakdown(filteredData) {
  let additions = {};
  let subtractions = {};
  let totalAdditions = 0;
  let totalSubtractions = 0;

  // Iterate over each year in the filtered data
  Object.keys(filteredData).forEach((year) => {
    // Iterate over each month in the year
    Object.keys(filteredData[year]).forEach((month) => {
      const payroll = filteredData[year][month];

      // Process additions
      if (payroll.additions) {
        Object.keys(payroll.additions).forEach((key) => {
          const amount = payroll.additions[key];

          // Accumulate the total for each addition type
          if (!additions[key]) {
            additions[key] = 0;
          }
          additions[key] += amount;
          totalAdditions += amount;
        });
      }

      // Process subtractions
      if (payroll.subtractions) {
        Object.keys(payroll.subtractions).forEach((key) => {
          const amount = payroll.subtractions[key];

          // Accumulate the total for each subtraction type
          if (!subtractions[key]) {
            subtractions[key] = 0;
          }
          subtractions[key] += amount;
          totalSubtractions += amount;
        });
      }
    });
  });

  // Calculate net pay (total additions - total subtractions)
  const netPay = totalAdditions - totalSubtractions;

  return {
    netPay,
    additions,
    subtractions,
    totalAdditions,
    totalSubtractions,
  };
}
