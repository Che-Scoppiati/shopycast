import { Variant, addApikeyUser, addShop, getShop } from "@/lib/mongodb";
import { extractShopId, getAllProductsFromShopify } from "@/lib/shopify";
import { NextRequest, NextResponse } from "next/server";
import { Product as ProductMongo } from "@/lib/mongodb";
import { Product as ShopifyProduct } from "@/lib/shopify";

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

const postHandler = async (req: NextRequest) => {
  const { user_id, shopName, shopUrl, secretName, secretValue } =
    await req.json();

  // get shop products
  const { shopifyData } = await getAllProductsFromShopify(shopUrl, secretValue);

  const shopId = extractShopId(shopifyData?.shop?.id);

  if (!shopId) {
    return NextResponse.json({ error: "shop id not found" });
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

export const GET = getHandler;
export const POST = postHandler;
