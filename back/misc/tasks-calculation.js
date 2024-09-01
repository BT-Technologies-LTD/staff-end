export default function (tasks_data) {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const tasks = tasks_data[currentYear];
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const pendingOrInProgressTasks = tasks.filter(
    (task) => task.status === "pending" || task.status === "in_progress"
  ).length;

  const totalTasks = completedTasks + pendingOrInProgressTasks;

  let completedTasksCurrentYear = 0;
  let completedTasksPreviousYear = 0;

  let percentageIncrease = 0;
  let completed_tasks = 0;
  let isPositive = true;
  let completionPercentage = 0;
  let totalSeconds = 0;

  if (tasks_data[currentYear]) {
    completedTasksCurrentYear = tasks_data[currentYear].filter(
      (task) => task.status === "completed"
    ).length;
  }

  if (tasks_data[previousYear]) {
    completedTasksPreviousYear = tasks_data[previousYear].filter(
      (task) => task.status === "completed"
    ).length;
  }

  if (completedTasksPreviousYear > 0) {
    percentageIncrease =
      ((completedTasksCurrentYear - completedTasksPreviousYear) /
        completedTasksPreviousYear) *
      100;
    isPositive = percentageIncrease >= 0;
    percentageIncrease = Math.abs(percentageIncrease);
  } else if (
    completedTasksPreviousYear === 0 &&
    completedTasksCurrentYear > 0
  ) {
    percentageIncrease = 100;
  }

  for (const year in tasks_data) {
    const completedTasks = tasks_data[year].filter(
      (task) => task.status === "completed"
    );

    completed_tasks += completedTasks.length;
  }

  if (!tasks_data[currentYear]) {
    completionPercentage = 0;
  }

  if (totalTasks === 0) {
    completionPercentage = completedTasks > 0 ? 100 : 0;
  }

  completionPercentage = (completedTasks / totalTasks) * 100;

  // Iterate through each year's tasks
  for (const year in tasks_data) {
    const tasks = tasks_data[year];
    // Sum up the time_taken for each task
    tasks.forEach((task) => {
      if (task.time_taken) {
        totalSeconds += task.time_taken * 3600; // Convert hours to seconds
      }
    });
  }

  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    percentageIncrease: percentageIncrease.toFixed(0),
    completed_tasks: completed_tasks,
    not_completed_tasks: pendingOrInProgressTasks,
    is_positive: isPositive,
    completion_percentage: completionPercentage.toFixed(0),
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}
