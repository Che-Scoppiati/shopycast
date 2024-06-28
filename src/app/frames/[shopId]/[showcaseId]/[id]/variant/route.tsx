import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { extractParamsFromUrl } from "@/lib/frames";
import { ProductSelectVariant } from "@/app/frames/components/product-select-variant";
import { AddToCartSuccess } from "@/app/frames/components";
import {
  ProductCart,
  ShowcaseWithDetails,
  addProductToCart,
  getCart,
  getShowcase,
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
  const startFromPrice = Math.min(
    ...(product?.variants.map((variant) => variant?.price ?? 0) ?? [0]),
  );

  // get variants names from product variants
  const variants: string[] = [];
  product?.variants.map((variant) => {
    variants.push(variant?.value);
  });

  const cart = await getCart(user.username, shopId, showcaseId);
  const cartCount =
    cart?.products.reduce((acc, product) => acc + product.quantity, 0) ?? 0;

  const size = ctx.url.searchParams.get("size");
  if (size) {
    const variant = product.variants.find((v) => v.value === size);
    if (!variant) {
      throw new Error("Variant not found");
    }
    let productsToSave: ProductCart = {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      currency: product.currency,
      variant,
      quantity: 1,
    };

    console.log("productsToSave", productsToSave);
    await addProductToCart(user.username, shopId, showcaseId, productsToSave);
    console.log("product added to cart");

    const cart = await getCart(user.username, shopId, showcaseId);
    const numberOfProducts =
      cart?.products.reduce((acc, product) => acc + product.quantity, 0) ?? 0;

    return {
      image: (
        <AddToCartSuccess
          user={user}
          product={productsToSave}
          numberOfProducts={numberOfProducts}
          shopName={showcase?.shop.name}
        />
      ),
      buttons: [
        <Button action="post" key="1" target={`/${shopId}/${showcaseId}/cart`}>
          Continue shopping 🛍️
        </Button>,
        <Button
          action="post"
          key="2"
          target={`/${shopId}/${showcaseId}/cart/checkout`}
        >
          Cart 🛒
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
          user={user}
          cartCount={cartCount}
          shopName={showcase?.shop.name}
        />
      ),
      buttons: [
        variants[0] ? (
          <Button
            action="post"
            key="1"
            target={`/${shopId}/${showcaseId}/${productId}/variant?size=${product?.variants[0].value}`}
          >
            {variants[0]}
          </Button>
        ) : undefined,
        variants[1] ? (
          <Button
            action="post"
            key="2"
            target={`/${shopId}/${showcaseId}/${productId}/variant?size=${product?.variants[1].value}`}
          >
            {variants[1]}
          </Button>
        ) : undefined,
        variants[2] ? (
          <Button
            action="post"
            key="3"
            target={`/${shopId}/${showcaseId}/${productId}/variant?size=${product?.variants[2].value}`}
          >
            {variants[2]}
          </Button>
        ) : undefined,
        variants[3] ? (
          <Button
            action="post"
            key="4"
            target={`/${shopId}/${showcaseId}/${productId}/variant?size=${product?.variants[3].value}`}
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
