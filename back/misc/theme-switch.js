document.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const themeController = document.querySelector(".theme-controller");

  if (theme === "dark") {
    themeController.checked = true;
  } else {
    themeController.checked = false;
  }
});
