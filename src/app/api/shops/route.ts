import { addApikeyUser, addShop, getShop } from "@/lib/mongodb";
import { extractShopId, getAllProducts } from "@/lib/shopify";
import { NextRequest, NextResponse } from "next/server";

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
  const { shopifyData, errors, extensions } = await getAllProducts(
    shopUrl,
    secretValue,
  );

  const shopId = extractShopId(shopifyData?.shop?.id);

  if (!shopId) {
    return NextResponse.json({ error: "shop id not found" });
  }

  const result = await addShop(
    user_id,
    shopName,
    shopUrl,
    shopId,
    secretName,
    shopifyData.products.nodes,
  );

  // save apikey: true to user
  await addApikeyUser(user_id);

  return NextResponse.json({ shop: result, shopId: shopId });
};

export const GET = getHandler;
export const POST = postHandler;
