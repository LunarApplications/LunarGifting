window.updateCartAttributes = async (properties) => {
  const root = window.Shopify?.routes?.root || "/";

  return await fetch(`${root}cart/update.js`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      attributes: properties,
    }),
  });
};
