import {
  Variant,
  addApikeyUser,
  addShop,
  editShopInfo,
  editShopProducts,
  getShop,
} from "@/lib/mongodb";
import { extractShopId, getAllProductsFromShopify } from "@/lib/shopify";
import { NextRequest, NextResponse } from "next/server";
import { Product as ProductMongo } from "@/lib/mongodb";
import { Product as ShopifyProduct } from "@/lib/shopify";
import { appURL } from "@/lib/utils";
import { type UpdateResult } from "mongodb";

const getHandler = async (req: NextRequest) => {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);

  const user_id = searchParams.get("user_id") || "";
  const shop_id = searchParams.get("shop_id") || "";
  if (!user_id || !shop_id) {
    return NextResponse.json({ error: "missing args" });
  }

  const result = await getShop(user_id, shop_id);
  return NextResponse.json({ shop: result });
};

async function getShopProducts(shopUrl: string, secretValue: string) {
  const { shopifyData } = await getAllProductsFromShopify(shopUrl, secretValue);

  const shopId = extractShopId(shopifyData?.shop?.id);

  if (!shopId) {
    return { shopId: "", mongoDbProducts: [], error: "shop id not found" };
  }

  const shopifyProducts = shopifyData.products.nodes;

  const mongoDbProducts: ProductMongo[] = (
    shopifyProducts as ShopifyProduct[]
  ).map((product) => {
    const variants = product.variants.edges
      .map((variant) => {
        if (variant.node.availableForSale)
          return {
            id: variant.node.id,
            name: "Size",
            value:
              variant.node.selectedOptions.find(
                (option) => option.name === "Size",
              )?.value || "",
            price: parseFloat(variant.node.price.amount),
          };
      })
      .filter((variant) => variant !== undefined) as Variant[];
    const setVariants = new Set(variants);
    return {
      id: product.id,
      name: product.title,
      description: product.description,
      image: product.variants.edges[0].node.image.url,
      currency: "USD",
      variants: Array.from(setVariants),
    };
  });
  return { shopId, mongoDbProducts };
}

const postHandler = async (req: NextRequest) => {
  const { user_id, shopName, shopUrl, secretName, secretValue } =
    await req.json();

  // get shop products
  const { shopId, mongoDbProducts, error } = await getShopProducts(
    shopUrl,
    secretValue,
  );

  if (error) {
    return NextResponse.json({ error });
  }

  const result = await addShop(
    user_id,
    shopName,
    shopUrl,
    shopId,
    secretName,
    mongoDbProducts,
  );

  // save apikey: true to user
  await addApikeyUser(user_id);

  return NextResponse.json({ shop: result, shopId: shopId });
};

const putHandler = async (req: NextRequest) => {
  const { shop_id, user_id, secretName, shopName, shopUrl, updateProducts } =
    await req.json();

  if (!shop_id || !user_id || !shopName || !shopUrl) {
    return NextResponse.json({ error: "shop id not found" });
  }

  let result: UpdateResult<Document>;
  if (updateProducts) {
    if (!secretName) {
      return NextResponse.json({ error: "missing args" });
    }

    const { secretValue } = await fetch(
      `${appURL()}/api/secret?secretName=${secretName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => res.json());

    // get shop products
    const { shopId, mongoDbProducts, error } = await getShopProducts(
      shopUrl,
      secretValue,
    );

    if (error) {
      return NextResponse.json({ error });
    }

    result = await editShopProducts(
      user_id,
      shop_id,
      shopName,
      shopUrl,
      mongoDbProducts,
    );
  }

  result = await editShopInfo(user_id, shop_id, shopName, shopUrl);

  return NextResponse.json({ shop: result, shopId: shop_id });
};

export const GET = getHandler;
export const POST = postHandler;
export const PUT = putHandler;
