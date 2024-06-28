/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { extractParamsFromUrl, imageOptions } from "@/lib/frames";
import { ProductGallery } from "@/app/frames/components/product-gallery";
import {
  ShowcaseWithDetails,
  deleteCart,
  getCart,
  getShowcaseWithDetails,
} from "@/lib/mongodb";

const handler = frames(async (ctx) => {
  if (!ctx.message?.isValid) {
    throw new Error("Invalid message");
  }

  const user = {
    ...ctx.message.requesterUserData,
    fid: ctx.message.requesterFid,
  };

  if (!user || !user.username) {
    throw new Error("Username not found");
  }

  const { shopId, showcaseId } = extractParamsFromUrl(ctx.url.pathname);

  const showcase: ShowcaseWithDetails | null = await getShowcaseWithDetails(
    shopId,
    showcaseId,
  );

  if (!showcase) {
    throw new Error("Showcase not found");
  }

  const resetCart = ctx.url.searchParams.get("resetCart");

  if (resetCart) {
    await deleteCart(user.fid.toString(), shopId, showcaseId);
    console.log("Cart deleted");
  }

  const cart = await getCart(user.fid.toString(), shopId, showcaseId);

  const numberOfProducts =
    cart?.products.reduce((acc, product) => acc + product.quantity, 0) ?? 0;

  return {
    image: (
      <ProductGallery
        showcase={showcase}
        cartCount={numberOfProducts}
        user={user}
      />
    ),
    buttons: [
      <Button
        action="post"
        key="1"
        target={`${shopId}/${showcaseId}/cart/checkout`}
      >
        Cart 🛒
      </Button>,
      <Button
        action="post"
        key="2"
        target={`${shopId}/${showcaseId}/1?numberOfPages=${showcase.products.length}`}
      >
        View Products
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
