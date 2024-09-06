export default function (salary_data) {
  const finalPay = {};

  const monthNames = [
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

  for (const year in salary_data) {
    finalPay[year] = {};

    for (const monthNum in salary_data[year]) {
      const month = monthNames[Number(monthNum)]; // Convert monthNum to number and use as index

      const additions = salary_data[year][monthNum].additions;
      const subtractions = salary_data[year][monthNum].subtractions;

      const totalAdditions = Object.values(additions).reduce(
        (acc, value) => acc + value,
        0
      );
      const totalSubtractions = Object.values(subtractions).reduce(
        (acc, value) => acc + value,
        0
      );

      finalPay[year][month] = {
        finalPay: totalAdditions - totalSubtractions,
      };
    }
  }

  return finalPay;
}
