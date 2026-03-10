import '@shopify/ui-extensions/preact';
import {render } from "preact";
import {useAttributeValues, useApplyAttributeChange} from '@shopify/ui-extensions/checkout/preact';

// 1. Export the extension
export default async () => {
  render(<Extension />, document.body)
};

function Extension() {
const [giftRecipient, giftMessage] =
    useAttributeValues([
      'Gift Recipient',
      'Gift Message'
    ]);


  // 2. Check instructions for feature availability
  if (!shopify.instructions.value.metafields.canSetCartMetafields) {
    return (
      <s-banner heading="Gifts" tone="warning">
        {shopify.i18n.translate("metafieldChangesAreNotSupported")}
      </s-banner>
    );
  }
console.log('shopify',shopify)
  const freeGiftRequested = shopify.appMetafields.value.find(
    (appMetafield) =>
      appMetafield.target.type === "cart" &&
      appMetafield.metafield.namespace === "$app" &&
      appMetafield.metafield.key === "requestedFreeGift",
  );


  // 3. Render a UI
  return (
    <s-stack direction="block" background="subdued" padding="base base base large-200" borderRadius="base base base small-100">
      <s-stack direction='inline' gap="base small-200" alignItems="center">
        <s-icon size="large" type="gift-card"/>
        <s-heading>Confirm Gift Recipient Details</s-heading>
      </s-stack>
      <s-stack gap="base">
       
        <s-text>
          {shopify.i18n.translate("Please verify the gift recipient details.")}
        </s-text>
          <s-text-field value={giftRecipient} />
          <s-text-area value={giftMessage}/>
     
      </s-stack>
    </s-stack>
  );

  }