/**
 * This file handles adding the item to the cart and then updating the cart attributes.
//  */
// import addItemToCart from "./addItemToCart";
// import updateCartAttributes from "./updateCartAttributes";

saveGiftDetailsAndAddToCart = async (form, variantId) => {
  const giftFormData = new FormData(form);

  const lineItemProperties = {};

  for (const [key, value] of giftFormData.entries()) {
    lineItemProperties[key] = value;
  }
  console.log("variantId", variantId);

  console.log("lineItemProperties", lineItemProperties);

  const formData = {
    items: [
      {
        id: variantId,
        quantity: 1,
        // lineItemProperties,
      },
    ],
  };
  //   Add line item props
  // await fetch(window.Shopify.routes.root + "cart/add.js", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(formData),
  // });

  window.addItemToCart(formData).then(() => {
    updateCartAttributes(lineItemProperties);
  });

  // Add cart props
  // await fetch("/cart/update.js", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     attributes: lineItemProperties,
  //   }),
  // });

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
};
