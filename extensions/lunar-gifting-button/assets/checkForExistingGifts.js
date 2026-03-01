window.checkForExistingGifts = async function () {
  return fetch("/cart.js")
    .then((response) => response.json())
    .then((cart) => {
      console.log("cart DaTA", cart);
      if (cart.attributes._digiGifts) {
        return cart.attributes._digiGifts;
      } else {
        return undefined;
      }
    })
    .catch((error) => console.error("Error fetching cart:", error));
};
