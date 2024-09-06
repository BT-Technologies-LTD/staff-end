document.getElementById("form").addEventListener("submit", function () {
  document.getElementById("submit").disabled = true;
  document.getElementById("submit").textContent = "Loading..."; // Optional: Update button text
});
