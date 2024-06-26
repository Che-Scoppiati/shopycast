/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { imageOptions } from "@/lib/frames";
import { FrameLanding } from "@/app/frames/components/frame-landing";

const handler = frames(async (ctx) => {
  const shopId = ctx.url.pathname.split("/frames/")[1].split("/")[0] ?? "";
  try {
    if (!ctx.message?.isValid) {
      throw new Error("Invalid message");
    }

    return {
      image: <FrameLanding title={shopId} />,
      buttons: [
        <Button action="post" key="1" target={`/${shopId}/buy`}>
          Buy
        </Button>,
      ],
      imageOptions: {
        ...imageOptions,
        aspectRatio: "1:1",
      },
    };
  } catch (error) {
    const errorMsg = (error as Error).message;
    return {
      image: <FrameLanding title={errorMsg} />,
      buttons: [
        <Button action="post" key="1" target="/">
          Home
        </Button>,
      ],
      imageOptions: {
        ...imageOptions,
        aspectRatio: "1:1",
      },
      error: errorMsg,
    };
  }
});

export const GET = handler;
export const POST = handler;
