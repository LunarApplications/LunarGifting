window.clearCartAttributes = async function () {
  console.log("doing null");
  fetch("/cart/update.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      attributes: {
        _digiGifts: "",
        giftDetails: "",
        giftsAdded: "",
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Cart Cleared:", data.attributes);
    })
    .catch((error) => {
      console.error("Error Clearing cart:", error);
    });
};
