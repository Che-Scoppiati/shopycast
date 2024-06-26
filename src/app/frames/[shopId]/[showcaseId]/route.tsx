/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { extractParamsFromUrl, imageOptions } from "@/lib/frames";
import { ProductGallery } from "@/app/frames/components/product-gallery";
import { Showcase, getShowcase } from "@/lib/mongodb";

const handler = frames(async (ctx) => {
  const { shopId, showcaseId } = extractParamsFromUrl(ctx.url.pathname);

  const showcase: Showcase | null = await getShowcase(shopId, showcaseId);

  if (!showcase) {
    throw new Error("Showcase not found");
  }

  return {
    image: <ProductGallery products={showcase.products} />,
    buttons: [
      <Button action="link" key="1" target="https://onchain-shop.vercel.app">
        create your showcase
      </Button>,
      <Button
        action="post"
        key="2"
        target={`${shopId}/${showcaseId}/1?numberOfPages=${showcase.products.length}`}
      >
        view them
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
