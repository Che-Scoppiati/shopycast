/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { extractParamsFromUrl, imageOptions } from "@/lib/frames";
import {
  ShowcaseWithDetails,
  getCart,
  getShowcaseWithDetails,
} from "@/lib/mongodb";
import { CartCheckout } from "@/app/frames/components/cart-checkout";
import { getShopifyCheckoutUrl } from "@/lib/utils";

const handler = frames(async (ctx) => {
  if (!ctx.message?.isValid) {
    throw new Error("Invalid message");
  }

  const user = {
    ...ctx.message.requesterUserData,
    fid: ctx.message.requesterFid,
  };

  if (!user || !user.username) {
    throw new Error("User not found");
  }

  const { shopId, showcaseId } = extractParamsFromUrl(ctx.url.pathname);

  const showcase: ShowcaseWithDetails | null = await getShowcaseWithDetails(
    shopId,
    showcaseId,
  );

  if (!showcase) {
    throw new Error("Showcase not found");
  }

  const cart = await getCart(user.fid.toString(), shopId, showcaseId);

  const refFid = ctx.message.castId?.fid.toString() || "";
  const shopifyCheckoutUrl = getShopifyCheckoutUrl(
    showcase.shop.url,
    cart,
    refFid,
  );

  const cartCount =
    cart?.products.reduce((acc, product) => acc + product.quantity, 0) ?? 0;

  return {
    image: (
      <CartCheckout
        cart={cart}
        cartCount={cartCount}
        user={user}
        shopName={showcase.shop.name}
      />
    ),
    buttons: [
      <Button action="post" key="1" target={`${shopId}/${showcaseId}/cart/`}>
        Continue to Shopping 🛍️
      </Button>,
      <Button
        action="post"
        key="2"
        target={`${shopId}/${showcaseId}/cart?resetCart=1`}
      >
        Reset Cart 🔄
      </Button>,
      <Button action="link" key="3" target={shopifyCheckoutUrl}>
        Pay on Shopify 💵
      </Button>,
    ],
    imageOptions: {
      ...imageOptions,
      aspectRatio: "1:1",
    },
  };
});

export const GET = handler;
export const POST = handler;
