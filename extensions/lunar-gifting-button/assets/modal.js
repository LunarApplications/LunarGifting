document
  .getElementById("__giftsAddAsGift__Button")
  .addEventListener("click", async (ele) => {
    const giftExists = await checkForExistingGifts();
    if (!giftExists) {
      const element = document.getElementById("_digiGifts_modal");
      element.classList.add("show"); // Adds the CSS class "new-class"
    } else {
      const element = document.getElementById("__giftsAddAsGift__Button");
      const variantId = element.attributes["data-variant-id"].value;
      window.addGift(giftExists, variantId);
    }
  });

document
  .getElementById("__giftsAddAsGift__ModalClose")
  .addEventListener("click", async (ele) => {
    window.resetErrorMessages();
    const element = document.getElementById("_digiGifts_modal");
    element.classList.remove("show"); // Adds the CSS class "new-class"
  });
