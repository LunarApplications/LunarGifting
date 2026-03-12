window.updateCartAttributes = async (properties) => {
  return await fetch("/cart/update.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      attributes: properties,
    }),
  });
};
