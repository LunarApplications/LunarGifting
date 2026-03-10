/**
 * This file handles adding the item to the cart and then updating the cart attributes.
 */
const addToCart = async () => {
  const addToCartButton = document.getElementById("lunar-save-gift-details");
  const lineItemProperties = {
    "Gift Recipient": "Alice",
    "Gift Message": "Happy Birthday!",
    "Wrap Type": "Gold Foil",
  };

  const formData = {
    items: [
      {
        id: addToCartButton.dataset.variantId,
        quantity: 1,
        // lineItemProperties,
      },
    ],
  };
  //   Add line item props
  await fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  // Add cart props
  await fetch("/cart/update.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      attributes: lineItemProperties,
    }),
  });

  const response = await fetch(
    `${window.Shopify.routes.root}?sections=cart-drawer,cart-icon-bubble`,
  );

  const sections = await response.json();

  // Replace sections safely
  for (const section in sections) {
    const container = document.querySelector(
      `[data-section-id="${section}"], #${section}`,
    );

    if (container) {
      container.innerHTML = sections[section];
    }
  }

  const _GiftModal = document.getElementById("lunar-gift-modal");

  _GiftModal.addEventListener("click", function () {
    _GiftModal.style.display = "block";
  });
};
