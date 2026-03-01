window.validateForm = function () {
  window.resetErrorMessages();
  let isFormValid = true;
  // Get form values
  let recipientName = document
    .getElementById("digigifts-recipient-name")
    .value.trim();
  let recipientEmail = document
    .getElementById("digigifts-recipient-email")
    .value.trim();
  let message = document.getElementById("digigifts-message").value.trim();

  // Regular expression for validating email format
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation checks
  if (!recipientName) {
    document.getElementById("name-error").style.display = "inherit";
    document.getElementById("name-error").innerText =
      "This is a required field";
    isFormValid = false;
  }

  if (!recipientEmail) {
    console.log("Recipient Email is required.");
    document.getElementById("recipient-email-error").innerText =
      "This is a required field";
    document.getElementById("recipient-email-error").style.display = "inherit";
    isFormValid = false;
  } else if (!emailRegex.test(recipientEmail)) {
    console.log("Please enter a valid email address.");
    document.getElementById("recipient-email-error").style.display = "inherit";
    document.getElementById("recipient-email-error").innerText =
      "Please enter a valid email address.";
    isFormValid = false;
  }

  if (!message) {
    console.log("Gift Message is required.");
    document.getElementById("message-error").style.display = "inherit;";
    document.getElementById("message-error").innerText =
      "A Gift Message is required.";
    isFormValid = false;
  }

  return isFormValid;
};
