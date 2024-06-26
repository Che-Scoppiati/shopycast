/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { extractParamsFromUrl, imageOptions } from "@/lib/frames";
import { ProductGallery } from "@/app/frames/components/product-gallery";
import { ProductCart, Showcase, getShowcase } from "@/lib/mongodb";
import { CartCheckout } from "@/app/frames/components/cart-checkout";

const handler = frames(async (ctx) => {
  if (!ctx.message?.isValid) {
    throw new Error("Invalid message");
  }

  const username = ctx.message.requesterUserData?.username;

  if (!username) {
    throw new Error("Username not found");
  }

  const { shopId, showcaseId } = extractParamsFromUrl(ctx.url.pathname);

  const showcase: Showcase | null = await getShowcase(shopId, showcaseId);

  if (!showcase) {
    throw new Error("Showcase not found");
  }

  return {
    image: (
      <CartCheckout
        products={showcase.products as unknown as ProductCart[]}
        cartCount={4}
      />
    ),
    buttons: [
      <Button action="post" key="1" target={`${shopId}/${showcaseId}/cart/`}>
        Continue to Shopping 🛍️
      </Button>,
      <Button
        action="post"
        key="2"
        target={`${shopId}/${showcaseId}/1?numberOfPages=${showcase.products.length}`}
      >
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
