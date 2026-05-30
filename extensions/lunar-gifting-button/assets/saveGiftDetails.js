window.saveGiftDetailsAndAddToCart = async (form, variantId) => {
  const giftFormData = new FormData(form);

  const lineItemProperties = {};

  for (const [key, value] of giftFormData.entries()) {
    lineItemProperties[key] = value;
  }

  lineItemProperties._digiGifts = "true";

  await addLunarGiftItemToCart(variantId);

  const updateCartAttributes = await waitForLunarFunction("updateCartAttributes");
  const updateResponse = await updateCartAttributes(lineItemProperties);
  if (!updateResponse.ok) {
    throw new Error("Unable to save the gift details to the cart.");
  }

  await refreshLunarCartUi();
  setLunarGiftButtonState(true);
  window.__lunarGiftCartNeedsOpenRefresh = true;
};

window.addProductToLunarGift = async (variantId) => {
  await addLunarGiftItemToCart(variantId);
  await refreshLunarCartUi();
  setLunarGiftButtonState(true);
  window.__lunarGiftCartNeedsOpenRefresh = true;
};

initLunarCartOpenRefresh();

async function addLunarGiftItemToCart(variantId) {
  const addItemToCart = await waitForLunarFunction("addItemToCart");
  const formData = {
    items: [
      {
        id: variantId,
        quantity: 1,
      },
    ],
  };

  const addResponse = await addItemToCart(formData);
  if (!addResponse.ok) {
    throw new Error("Unable to add the gift product to the cart.");
  }

  return addResponse;
}

async function waitForLunarFunction(functionName) {
  if (typeof window[functionName] === "function") {
    return window[functionName];
  }

  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 50;
    const interval = window.setInterval(() => {
      attempts += 1;

      if (typeof window[functionName] === "function") {
        window.clearInterval(interval);
        resolve(window[functionName]);
      }

      if (attempts >= maxAttempts) {
        window.clearInterval(interval);
        reject(new Error(`Lunar Gifting could not find ${functionName}.`));
      }
    }, 100);
  });
}

function setLunarGiftButtonState(hasGift) {
  document.querySelectorAll("[data-lunar-gift-button]").forEach((button) => {
    button.dataset.lunarHasGift = hasGift ? "true" : "false";

    if (hasGift && button.dataset.addToGiftText) {
      button.textContent = button.dataset.addToGiftText;
    }
  });
}

async function refreshLunarCartUi() {
  const root = window.Shopify?.routes?.root || "/";
  const cart = await fetch(`${root}cart.js`).then((response) => response.json());
  const sectionIds = getLunarCartSectionIds();

  updateLunarCartCount(cart);
  dispatchLunarCartEvents(cart);

  if (!sectionIds.length) {
    return cart;
  }

  try {
    const sections = await fetchLunarCartSections(root, sectionIds);
    renderLunarCartSections(sections);
    dispatchLunarCartEvents(cart);
  } catch (error) {
    console.warn("Lunar Gifting could not refresh cart sections.", error);
  }

  return cart;
}

async function fetchLunarCartSections(root, sectionIds) {
  const sections = {};
  const chunkSize = 5;
  const sectionUrls = Array.from(
    new Set([
      window.location.pathname + window.location.search,
      root,
      `${root}cart`,
    ]),
  );

  for (let index = 0; index < sectionIds.length; index += chunkSize) {
    const chunk = sectionIds.slice(index, index + chunkSize);

    for (const sectionUrl of sectionUrls) {
      const separator = sectionUrl.includes("?") ? "&" : "?";
      const response = await fetch(
        `${sectionUrl}${separator}sections=${chunk.join(",")}`,
      );
      const renderedSections = await response.json();

      Object.entries(renderedSections).forEach(([sectionId, html]) => {
        if (html && !sections[sectionId]) {
          sections[sectionId] = html;
        }
      });
    }
  }

  return sections;
}

function getLunarCartSectionIds() {
  const commonCartSections = [
    "cart-drawer",
    "cart-icon-bubble",
    "main-cart-items",
    "main-cart-footer",
    "cart-live-region-text",
    "cart-notification-product",
    "cart-notification-button",
    "header",
  ];

  const detectedCartSections = Array.from(
    document.querySelectorAll("[id^='shopify-section-']"),
  )
    .map((section) => section.id.replace("shopify-section-", ""))
    .filter((sectionId) => sectionId.includes("cart"));

  const cartContainerSections = Array.from(
    document.querySelectorAll(
      [
        "cart-drawer",
        "cart-notification",
        "mini-cart",
        "#CartDrawer",
        "#cart-drawer",
        "#mini-cart",
        "[data-cart-drawer]",
        "[data-cart-count]",
        ".cart-drawer",
        ".cart-notification",
        ".mini-cart",
        ".ajax-cart",
        ".drawer--cart",
        "[data-ajax-cart-section]",
      ].join(","),
    ),
  )
    .map((element) => element.closest("[id^='shopify-section-']"))
    .filter(Boolean)
    .map((section) => section.id.replace("shopify-section-", ""));

  return Array.from(
    new Set([
      ...commonCartSections,
      ...detectedCartSections,
      ...cartContainerSections,
    ]),
  );
}

function renderLunarCartSections(sections) {
  Object.entries(sections).forEach(([sectionId, html]) => {
    if (!html) {
      return;
    }

    const parsedHtml = new DOMParser().parseFromString(html, "text/html");
    const section = document.getElementById(`shopify-section-${sectionId}`);
    if (section) {
      const renderedSection = parsedHtml.getElementById(
        `shopify-section-${sectionId}`,
      );
      section.innerHTML = renderedSection ? renderedSection.innerHTML : html;
      return;
    }

    const fallbackContainer = document.querySelector(
      `[data-section-id="${sectionId}"], #${sectionId}`,
    );
    if (fallbackContainer) {
      const renderedFallback =
        parsedHtml.querySelector(`[data-section-id="${sectionId}"]`) ||
        parsedHtml.getElementById(sectionId);
      fallbackContainer.innerHTML = renderedFallback
        ? renderedFallback.innerHTML
        : html;
      return;
    }

    renderLunarCartContainer(sectionId, parsedHtml);
  });
}

function renderLunarCartContainer(sectionId, parsedHtml) {
  const selectorsBySection = {
    "cart-drawer": [
      "cart-drawer",
      "#CartDrawer",
      "#cart-drawer",
      "[data-cart-drawer]",
      ".cart-drawer",
      ".drawer--cart",
      ".mini-cart",
      "#mini-cart",
    ],
    "cart-notification-product": [
      "cart-notification",
      "#cart-notification",
      ".cart-notification",
    ],
    "cart-notification-button": [
      "cart-notification",
      "#cart-notification",
      ".cart-notification",
    ],
    header: [
      "header",
      "#shopify-section-header",
      ".shopify-section-header",
      ".site-header",
    ],
  };

  const selectors = selectorsBySection[sectionId] || [];

  selectors.some((selector) => {
    const currentElement = document.querySelector(selector);
    const renderedElement = parsedHtml.querySelector(selector);

    if (!currentElement || !renderedElement) {
      return false;
    }

    currentElement.innerHTML = renderedElement.innerHTML;
    return true;
  });
}

function updateLunarCartCount(cart) {
  const count = cart.item_count;
  const countSelectors = [
    "[data-cart-count]",
    ".cart-count",
    ".cart-count-bubble span:not(.visually-hidden)",
    ".header__cart-count",
    ".site-header__cart-count",
    ".cart-link__bubble-num",
    ".cart-count-number",
  ];

  document.querySelectorAll(countSelectors.join(",")).forEach((element) => {
    element.textContent = count;
    element.setAttribute("data-cart-count", count);
  });

  document.querySelectorAll(".cart-count-bubble").forEach((bubble) => {
    bubble.hidden = count === 0;
    bubble.classList.toggle("hidden", count === 0);
  });
}

function dispatchLunarCartEvents(cart) {
  [
    "cart:updated",
    "cart:refresh",
    "cart:change",
    "theme:cart:change",
    "ajaxProduct:added",
  ].forEach((eventName) => {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      detail: { cart },
    });
    document.dispatchEvent(event);
    window.dispatchEvent(new CustomEvent(eventName, { detail: { cart } }));
  });
}

function initLunarCartOpenRefresh() {
  if (window.__lunarGiftCartOpenRefreshInitialized) {
    return;
  }

  window.__lunarGiftCartOpenRefreshInitialized = true;

  document.addEventListener(
    "click",
    function (event) {
      if (!window.__lunarGiftCartNeedsOpenRefresh) {
        return;
      }

      if (!isLunarCartTrigger(event.target)) {
        return;
      }

      window.setTimeout(async function () {
        try {
          await refreshLunarCartUi();
        } finally {
          window.__lunarGiftCartNeedsOpenRefresh = false;
        }
      }, 150);

      window.setTimeout(function () {
        refreshLunarCartUi().catch(function (error) {
          console.warn("Lunar Gifting could not refresh the opened cart.", error);
        });
      }, 650);
    },
    true,
  );
}

function isLunarCartTrigger(element) {
  if (!(element instanceof Element)) {
    return false;
  }

  return Boolean(
    element.closest(
      [
        "a[href$='/cart']",
        "a[href*='/cart?']",
        "a[href*='/cart#']",
        "#cart-icon-bubble",
        ".header__icon--cart",
        ".site-header__cart",
        ".js-drawer-open-cart",
        "[aria-controls*='cart' i]",
        "[data-cart-toggle]",
        "[data-cart-drawer-toggle]",
        "[data-drawer-trigger*='cart' i]",
        "[data-drawer-id*='cart' i]",
      ].join(","),
    ),
  );
}
