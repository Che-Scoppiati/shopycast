import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { ProductView } from "@/app/frames/components/product-view";
import { extractParamsFromUrl } from "@/lib/frames";
import { getShowcase } from "@/lib/mongodb";

const handler = frames(async (ctx) => {
  if (!ctx.message?.isValid) {
    throw new Error("Invalid message");
  }

  const numberOfPages = parseInt(
    ctx.url.searchParams.get("numberOfPages") ?? "6",
  );

  const { shopId, showcaseId, productId } = extractParamsFromUrl(
    ctx.url.pathname,
  );

  const showcase = await getShowcase(shopId, showcaseId);

  const product = showcase?.products[parseInt(productId) - 1];

  if (!product) {
    throw new Error("Product not found");
  }

  // get minimum price from product variants
  let startingPrices;
  // get minimum price from product variants, if variant.length is 0, set price to 0
  if (product.variants.length === 0) {
    startingPrices = 0;
  } else {
    startingPrices = Math.min(
      ...product.variants.map((variant) => variant.price ?? 0),
    );
  }

  // get variants names from product variants
  const variants: string[] = [];
  product?.variants.map((variant) => {
    variants.push(variant?.value);
  });

  console.log("number of pages", numberOfPages, "current product", productId);

  return {
    image: (
      <ProductView
        name={product?.name ?? "product name"}
        image={product?.image}
        startingPrice={startingPrices}
        description={product?.description ?? "product description"}
        currency={product?.currency ?? "USD"}
        variants={variants}
        soldout={product?.variants.length === 0}
      />
    ),
    buttons: [
      <Button
        action="post"
        key="1"
        target={
          productId === `1`
            ? `/${shopId}/${showcaseId}/`
            : `/${shopId}/${showcaseId}/${parseInt(productId) - 1}?numberOfPages=${numberOfPages}`
        }
      >
        {productId === "1" ? "back to showcase" : "<"}
      </Button>,
      product?.variants.length !== 0 ? (
        <Button
          action="post"
          key="2"
          target={`/${shopId}/${showcaseId}/${productId}/variant`}
        >
          Buy
        </Button>
      ) : undefined,
      <Button
        action="post"
        key={product?.variants.length !== 0 ? "3" : "2"}
        target={
          productId === `${numberOfPages}`
            ? `/${shopId}/${showcaseId}/`
            : `/${shopId}/${showcaseId}/${parseInt(productId) + 1}?numberOfPages=${numberOfPages}`
        }
      >
        {productId === `${numberOfPages}` ? "back to showcase" : ">"}
      </Button>,
    ],
    imageOptions: {
      aspectRatio: "1.91:1",
    },
  };
});

export const GET = handler;
export const POST = handler;
