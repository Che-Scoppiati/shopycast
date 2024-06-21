/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { imageOptions } from "@/lib/utils";
import { FrameLanding } from "@/app/frames/components/frame-landing";
import { ProductGallery } from "./components/product-gallery";

const products = [
  {
    name: "t-shirt nike",
    prices: [10.99],
    currency: "USD",
  },
  {
    name: "t-shirt adidas",
    prices: [12.99],
    currency: "USD",
  },
  {
    name: "t-shirt puma",
    prices: [14.99],
    currency: "USD",
  },
  {
    name: "t-shirt nike",
    prices: [10.99],
    currency: "USD",
  },
  {
    name: "t-shirt adidas",
    prices: [12.99],
    currency: "USD",
  },
  {
    name: "t-shirt puma",
    prices: [14.99],
    currency: "USD",
  },
];

const handler = frames(async (ctx) => {
  return {
    image: <ProductGallery products={products} />,
    buttons: [
      <Button action="post" key="1" target="/view-products">
        view products
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
