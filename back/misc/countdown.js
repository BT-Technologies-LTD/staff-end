document.addEventListener("DOMContentLoaded", () => {
  function calculateTimeLeft(acceptDate, hoursToComplete) {
    const now = new Date();
    const endDate = new Date(
      new Date(acceptDate).getTime() + hoursToComplete * 60 * 60 * 1000
    );
    const timeLeft = endDate - now;

    if (timeLeft <= 0) return null;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  function updateCountdown() {
    document.querySelectorAll(".countdown").forEach((element) => {
      const acceptDate = element.getAttribute("data-accept-date");
      const hoursToComplete = parseInt(
        element.getAttribute("data-hours-to-complete"),
        10
      );
      const index = element.getAttribute("data-index");

      const timeLeft = calculateTimeLeft(acceptDate, hoursToComplete);

      if (timeLeft) {
        [
          { id: `days-${index}`, value: timeLeft.days },
          { id: `hours-${index}`, value: timeLeft.hours },
          { id: `minutes-${index}`, value: timeLeft.minutes },
          { id: `seconds-${index}`, value: timeLeft.seconds },
        ].forEach(({ id, value }) => {
          document
            .querySelector(`#${id}`)
            .querySelector("span")
            .style.setProperty("--value", value);
        });
      } else {
        document.querySelector(".countdown-div").textContent = "Expired";
      }
    });
  }

  setInterval(updateCountdown, 1000);

  updateCountdown();
});
