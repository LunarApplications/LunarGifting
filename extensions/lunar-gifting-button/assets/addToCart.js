const addToCartButton = document.getElementById("lunarGifts_AddToCart__Button");

addToCartButton.addEventListener("click", async () => {
  const formData = {
    items: [
      {
        id: addToCartButton.dataset.variantId,
        quantity: 1,
      },
    ],
  };

  await fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
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

  //   await fetch(
  //     window.Shopify.routes.root + "?sections=cart-icon-bubble,cart-drawer",
  //   )
  //     .then((res) => res.json())
  //     .then((sections) => {
  //       Object.keys(sections).forEach((key) => {
  //         const container = document.querySelector(`[id*="${key}"]`);
  //         if (container) {
  //           container.innerHTML = sections[key];
  //         }
  //       });
  //     });
  //   const cart = await fetch("/cart.js").then((res) => res.json());

  //   const possibleSelectors = [
  //     ".cart-count-bubble",
  //     ".cart-count",
  //     ".header__cart-count",
  //     "[data-cart-count]",
  //     "#cart-icon-bubble",
  //   ];

  //   possibleSelectors.forEach((selector) => {
  //     document.querySelectorAll(selector).forEach((el) => {
  //       el.textContent = cart.item_count;
  //     });
  //   });

  //   document.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));

  //   document.dispatchEvent(new CustomEvent("cart:refresh", { bubbles: true }));

  //   document.dispatchEvent(new Event("cart:change"));

  // .then((response) => {
  //   return response.json();
  // })
  // .catch((error) => {
  //   console.error("Error:", error);
  // });
});
