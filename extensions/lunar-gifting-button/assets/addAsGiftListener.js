function checkIfVariantExists(variantId, giftArr) {
  return giftArr.indexOf(variantId);
}

window.addGift = async function (currentGiftBasket, variantId) {
  const giftData = currentGiftBasket;
  const alreadyExists = checkIfVariantExists(
    variantId,
    currentGiftBasket.giftsArray,
  );

  console.log(alreadyExists);

  if (alreadyExists === -1) {
    giftData.giftsArray.push(variantId);
  }

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
      //Change the submit button text.

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
        })
        .catch((error) => console.error("Error:", error));

      //---------
    })
    .catch((error) => {
      console.error("Error updating cart:", error);
    });
};
