window.resetErrorMessages = function () {
  document.getElementById("name-error").style.display = "none";
  document.getElementById("name-error").innerText = "";

  document.getElementById("recipient-email-error").style.display = "none;";
  document.getElementById("recipient-email-error").innerText = "";

  document.getElementById("message-error").style.display = "none;";
  document.getElementById("message-error").innerText = "";
};
