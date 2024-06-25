import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { extractParamsFromUrl } from "@/lib/frames";
import { ProductSelectVariant } from "@/app/frames/components/product-select-variant";
import { AddToCartSuccess } from "@/app/frames/components";

const handler = frames(async (ctx) => {
  if (!ctx.message?.isValid) {
    throw new Error("Invalid message");
  }

  const { shopId, showcaseId, productId } = extractParamsFromUrl(
    ctx.url.pathname,
  );

  console.log("user data", ctx.message.requesterUserData);
  const username = ctx.message?.requesterUserData?.username;

  if (!username) {
    throw new Error("Invalid username");
  }

  const size = ctx.url.searchParams.get("size");
  if (size) {
    return {
      image: (
        <AddToCartSuccess
          username={username}
          productName="t-shirt nike"
          variant={size}
        />
      ),
      buttons: [
        <Button action="post" key="1" target={`/`}>
          Continue shopping 🛍️
        </Button>,
        <Button
          action="post"
          key="2"
          target={`/${shopId}/${showcaseId}/cart?user=${username}`}
        >
          Checkout 💲
        </Button>,
      ],
      imageOptions: {
        aspectRatio: "1.91:1",
      },
    };
  } else {
    const variants = ["S", "M", "L", "XL"];
    return {
      image: (
        <ProductSelectVariant
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
        variants[0] ? (
          <Button
            action="post"
            key="1"
            target={`/${shopId}/${showcaseId}/${productId}/variant?size=${variants[0]}`}
          >
            {variants[0]}
          </Button>
        ) : undefined,
        variants[1] ? (
          <Button
            action="post"
            key="2"
            target={`/${shopId}/${showcaseId}/${productId}/variant?size=${variants[1]}`}
          >
            {variants[1]}
          </Button>
        ) : undefined,
        variants[2] ? (
          <Button
            action="post"
            key="3"
            target={`/${shopId}/${showcaseId}/${productId}/variant?size=${variants[2]}`}
          >
            {variants[2]}
          </Button>
        ) : undefined,
        variants[3] ? (
          <Button
            action="post"
            key="4"
            target={`/${shopId}/${showcaseId}/${productId}/variant?size=${variants[3]}`}
          >
            {variants[3]}
          </Button>
        ) : undefined,
      ],
      imageOptions: {
        aspectRatio: "1.91:1",
      },
    };
  }
});

export const GET = handler;
export const POST = handler;
