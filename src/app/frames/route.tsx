/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { imageOptions } from "@/lib/frames";
import { FrameLanding } from "./components";

const handler = frames(async (ctx) => {
  return {
    image: <FrameLanding title="test" />,
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
