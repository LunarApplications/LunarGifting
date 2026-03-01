document
  .getElementById("__giftsAddToCart__Button")
  .addEventListener("click", async (ele) => {
    alert("click");
    await clearCartAttributes();
  });
