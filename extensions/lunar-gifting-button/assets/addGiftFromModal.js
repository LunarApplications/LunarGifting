document
  //   .getElementById("__giftsAddAsGift__Button")
  .getElementById("submit-digigifts-form")
  .addEventListener("click", async (ele) => {
    //Check the form is valid first.
    const isValidForm = window.validateForm();

    //START OF IF
    if (isValidForm) {
      document.getElementById("submit-digigifts-form").innerHTML =
        "Submitting...";
      const form = document.getElementById("digi-gift-form");
      const variantId = form.attributes["data-variant-id"].value;
      const recipientName = document.getElementById(
        "digigifts-recipient-name",
      ).value;
      const recipientEmail = document.getElementById(
        "digigifts-recipient-email",
      ).value;
      const message = document.getElementById("digigifts-message").value;

      let currentGiftArray = [];

      currentGiftArray.push(variantId);

      const recipeintDetails = {
        name: recipientName,
        message: message,
        emailSendDate: "01/01/26",
        emailAddress: recipientEmail,
        timezone: null,
      };

      const giftData = {
        giftId: crypto.randomUUID(),
        recipient: recipeintDetails,
        giftsArray: currentGiftArray,
      };

      fetch("/cart/update.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          attributes: { _digiGifts: giftData },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Cart Attributes Updated:", data);
          //--------
          fetch("/cart/add.js", {
            method: "POST",
            body: JSON.stringify({
              quantity: 1,
              id: variantId,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              window.location.reload();
              console.log("Item added as a gift:", data);
            })
            .catch((error) => console.error("Error:", error));

          //---------
        })
        .catch((error) => {
          console.error("Error updating cart:", error);
        });
    } // END OF IF
  });
