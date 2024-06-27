import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { extractParamsFromUrl } from "@/lib/frames";
import { ProductSelectVariant } from "@/app/frames/components/product-select-variant";
import { AddToCartSuccess } from "@/app/frames/components";
import { getShowcase } from "@/lib/mongodb";

const handler = frames(async (ctx) => {
  if (!ctx.message?.isValid) {
    throw new Error("Invalid message");
  }

  const username = ctx.message.requesterUserData?.username;

  if (!username) {
    throw new Error("Username not found");
  }

  const { shopId, showcaseId, productId } = extractParamsFromUrl(
    ctx.url.pathname,
  );

  const showcase = await getShowcase(shopId, showcaseId);

  const product = showcase?.products[parseInt(productId) - 1];

  // get minimum price from product variants
  const startFromPrice = Math.min(
    ...(product?.variants.map((variant) => variant?.price ?? 0) ?? [0]),
  );

  // get variants names from product variants
  const variants: string[] = [];
  product?.variants.map((variant) => {
    variants.push(variant?.value || "");
  });

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
        <Button action="post" key="1" target={`/${shopId}/${showcaseId}`}>
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
    return {
      image: (
        <ProductSelectVariant
          name={product?.name ?? "product name"}
          image={product?.image}
          startingPrice={startFromPrice}
          description={product?.description}
          currency={product?.currency ?? "USD"}
          variants={variants}
          soldout={product?.variants.length === 0}
        />
      ),
      buttons: [
        variants[0] ? (
          <Button
            action="post"
            key="1"
            target={`/${shopId}/${showcaseId}/${productId}/variant?size=${product?.variants[0]?.value}`}
          >
            {variants[0]}
          </Button>
        ) : undefined,
        variants[1] ? (
          <Button
            action="post"
            key="2"
            target={`/${shopId}/${showcaseId}/${productId}/variant?size=${product?.variants[1]?.value}`}
          >
            {variants[1]}
          </Button>
        ) : undefined,
        variants[2] ? (
          <Button
            action="post"
            key="3"
            target={`/${shopId}/${showcaseId}/${productId}/variant?size=${product?.variants[2]?.value}`}
          >
            {variants[2]}
          </Button>
        ) : undefined,
        variants[3] ? (
          <Button
            action="post"
            key="4"
            target={`/${shopId}/${showcaseId}/${productId}/variant?size=${product?.variants[3]?.value}`}
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
