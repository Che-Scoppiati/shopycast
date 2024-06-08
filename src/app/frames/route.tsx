/* eslint-disable react/jsx-key */
import React from "react";
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { imageOptions } from "@/lib/utils";
import { FrameLanding } from "@/app/frames/components/frame-landing";

const handler = frames(async (ctx) => {
  return {
    image: <FrameLanding title="Welcome" />,
    buttons: [
      <Button action="post" key="1" target="/12345/buy">
        Buy
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
