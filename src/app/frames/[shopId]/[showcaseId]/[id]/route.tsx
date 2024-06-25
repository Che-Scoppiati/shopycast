import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { ProductView } from "@/app/frames/components/product-view";
import { extractParamsFromUrl } from "@/lib/frames";

const handler = frames(async (ctx) => {
  const { shopId, showcaseId, productId } = extractParamsFromUrl(
    ctx.url.pathname,
  );

  return {
    image: (
      <ProductView
        name="t-shirt nike"
        quantity={10}
        prices={[10.99]}
        description="massa figa sta maglia zio franco"
        currency="$"
        variants={["S", "M", "L", "XL"]}
        soldout
      />
    ),
    buttons: [
      <Button action="post" key="1" target="/">
        {"<"}
      </Button>,
      <Button
        action="post"
        key="2"
        target={`/${shopId}/${showcaseId}/${productId}/variant`}
      >
        Buy
      </Button>,
      <Button action="post" key="3" target="/">
        {">"}
      </Button>,
    ],
    imageOptions: {
      aspectRatio: "1.91:1",
    },
  };
});

export const GET = handler;
export const POST = handler;
