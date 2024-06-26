/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { imageOptions } from "@/lib/frames";
import { ProductGallery } from "./components/product-gallery";
import { Product } from "@/lib/mongodb";

const products: Product[] = [
  {
    id: "1",
    name: "t-shirt nike",
    description: "t-shirt nike description",
    image: "https://via.placeholder.com/150",
    currency: "$",
    variants: [
      {
        id: "1",
        name: "size",
        value: "S",
        price: 10.99,
      },
    ],
  },
  {
    id: "2",
    name: "t-shirt adidas",
    description: "t-shirt adidas description",
    image: "https://via.placeholder.com/150",
    currency: "$",
    variants: [
      {
        id: "1",
        name: "size",
        value: "S",
        price: 12.99,
      },
    ],
  },
  {
    id: "3",
    name: "t-shirt puma",
    description: "t-shirt puma description",
    image: "https://via.placeholder.com/150",
    currency: "$",
    variants: [
      {
        id: "1",
        name: "size",
        value: "S",
        price: 14.99,
      },
    ],
  },
  {
    id: "4",
    name: "t-shirt nike",
    description: "t-shirt nike description",
    image: "https://via.placeholder.com/150",
    currency: "$",
    variants: [
      {
        id: "1",
        name: "size",
        value: "M",
        price: 10.99,
      },
    ],
  },
  {
    id: "5",
    name: "t-shirt adidas",
    description: "t-shirt adidas description",
    image: "https://via.placeholder.com/150",
    currency: "$",
    variants: [
      {
        id: "1",
        name: "size",
        value: "M",
        price: 12.99,
      },
    ],
  },
  {
    id: "6",
    name: "t-shirt puma",
    description: "t-shirt puma description",
    image: "https://via.placeholder.com/150",
    currency: "$",
    variants: [
      {
        id: "1",
        name: "size",
        value: "M",
        price: 14.99,
      },
    ],
  },
];

const handler = frames(async (ctx) => {
  return {
    image: <ProductGallery products={products} />,
    buttons: [
      <Button action="link" key="1" target="https://onchain-shop.xyz">
        create your showcase
      </Button>,
      <Button action="post" key="2" target="/francoshop/show1/1">
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
