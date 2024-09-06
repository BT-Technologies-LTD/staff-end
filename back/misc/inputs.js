const salaryInput = document.getElementById("salary-input");
const nameInputs = document.querySelectorAll(".name-input");
const phoneInput = document.getElementById("phone-input");

phoneInput.addEventListener("input", function (e) {
  let value = e.target.value;

  // Remove any spaces or non-numeric characters
  value = value.replace(/\D/g, "");

  // Ensure the first digit is always '0'
  if (value.length > 0 && value[0] !== "0") {
    value = "0" + value.substring(1);
  }

  // Add space after the 4th and 7th digits
  if (value.length > 4) {
    value = value.substring(0, 4) + " " + value.substring(4);
  }
  if (value.length > 8) {
    value = value.substring(0, 8) + " " + value.substring(8);
  }

  // Update the input value with formatted string
  e.target.value = value;
});

salaryInput.addEventListener("input", function (e) {
  let value = e.target.value;

  // Remove any non-digit characters (except commas)
  value = value.replace(/[^0-9]/g, "");

  // Add commas as thousands separators
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Update the input value
  e.target.value = value;
});

function removeNumbers(e) {
  e.target.value = e.target.value.replace(/\d/g, "");
}

// Attach event listener to each input
nameInputs.forEach((input) => {
  input.addEventListener("input", removeNumbers);
});

document
  .getElementById("profile_photo")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const errorMessage = document.getElementById("upload_error_message");
    const maxWidth = 2000;
    const maxHeight = 2000;

    if (file) {
      const validTypes = ["image/jpeg", "image/png"];

      if (!validTypes.includes(file.type)) {
        errorMessage.textContent =
          "Invalid file type. Only JPEG and PNG images are allowed.";
        event.target.value = ""; // Clear the input
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = function (e) {
        img.onload = function () {
          if (img.width > maxWidth || img.height > maxHeight) {
            errorMessage.textContent = `Image dimensions exceed the allowed size of ${maxWidth}x${maxHeight} pixels.`;
            event.target.value = ""; // Clear the input
          } else {
            errorMessage.textContent = ""; // Clear any previous error message
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
