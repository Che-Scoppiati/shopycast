/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { extractParamsFromUrl, imageOptions } from "@/lib/frames";
import { appURL } from "@/lib/utils";
import {
  ShowcaseWithDetails,
  getCart,
  getShowcaseWithDetails,
} from "@/lib/mongodb";
import { CartCheckout } from "@/app/frames/components/cart-checkout";

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

  const referrerFid = ctx.message.castId?.fid.toString() || "";
  const referrerCastHash = ctx.message.castId?.hash;
  const shopifyCheckoutUrl = `${appURL()}/api/shopify/cart?userFid=${user.fid}&shopUrl=${showcase.shop.url}&referrerFid=${referrerFid}&shopId=${shopId}&showcaseId=${showcaseId}&referrerCastHash=${referrerCastHash}`;

  const cartCount =
    cart?.products.reduce((acc, product) => acc + product.quantity, 0) ?? 0;

  // return cart with at max 6 products
  if (cart?.products) {
    cart.products = cart.products.slice(0, 6);
  }

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
