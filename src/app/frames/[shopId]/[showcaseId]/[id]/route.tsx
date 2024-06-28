import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { ProductView } from "@/app/frames/components/product-view";
import { extractParamsFromUrl } from "@/lib/frames";
import {
  ShowcaseWithDetails,
  getCart,
  getShowcaseWithDetails,
} from "@/lib/mongodb";

const handler = frames(async (ctx) => {
  if (!ctx.message?.isValid) {
    throw new Error("Invalid message");
  }

  const user = ctx.message.requesterUserData;

  if (!user || !user.username) {
    throw new Error("User not found");
  }

  const numberOfPages = parseInt(
    ctx.url.searchParams.get("numberOfPages") ?? "6",
  );

  const { shopId, showcaseId, productId } = extractParamsFromUrl(
    ctx.url.pathname,
  );

  const showcase: ShowcaseWithDetails | null = await getShowcaseWithDetails(
    shopId,
    showcaseId,
  );

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

  const cart = await getCart(user.username, shopId, showcaseId);
  const cartCount =
    cart?.products.reduce((acc, product) => acc + product.quantity, 0) ?? 0;

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
        user={user}
        cartCount={cartCount}
        shopName={showcase?.shop.name}
      />
    ),
    buttons: [
      <Button
        action="post"
        key="1"
        target={`/${shopId}/${showcaseId}/cart?numberOfPages=${numberOfPages}`}
      >
        Home
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
        key="3"
        target={
          productId === `1`
            ? `/${shopId}/${showcaseId}/cart`
            : `/${shopId}/${showcaseId}/${parseInt(productId) - 1}?numberOfPages=${numberOfPages}`
        }
      >
        {"<"}
      </Button>,
      <Button
        action="post"
        key="4"
        target={
          productId === `${numberOfPages}`
            ? `/${shopId}/${showcaseId}/cart/`
            : `/${shopId}/${showcaseId}/${parseInt(productId) + 1}?numberOfPages=${numberOfPages}`
        }
      >
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
