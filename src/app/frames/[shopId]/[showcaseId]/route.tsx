/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { extractParamsFromUrl, imageOptions } from "@/lib/frames";
import { ProductGallery } from "@/app/frames/components/product-gallery";
import { ShowcaseWithDetails, getShowcaseWithDetails } from "@/lib/mongodb";

const handler = frames(async (ctx) => {
  const { shopId, showcaseId } = extractParamsFromUrl(ctx.url.pathname);

  const showcase: ShowcaseWithDetails | null = await getShowcaseWithDetails(
    shopId,
    showcaseId,
  );

  if (!showcase) {
    throw new Error("Showcase not found");
  }

  return {
    image: <ProductGallery showcase={showcase} />,
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
