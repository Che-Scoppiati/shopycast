import { getAllProducts } from "@/lib/shopify";
import { NextRequest, NextResponse } from "next/server";

const getHandler = async (req: NextRequest) => {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);

  const user_id = searchParams.get("user_id") || "";
  const shop_id = searchParams.get("shop_id") || "";

  // 1. fetch shop
  const shop = await fetch(`/api/shops?user_id=${user_id}&shop_id=${shop_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  if (!shop) {
    return NextResponse.json({ error: "shop not found" });
  }

  // 2. fetch shop api key
  const { secretValue } = await fetch(
    `/api/secret?secretName=${shop.secretName}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());
  if (!secretValue) {
    return NextResponse.json({ error: "api key not found" });
  }

  // 3. fetch shopify products
  const { shopifyData, errors, extensions } = await getAllProducts(
    shop.url,
    secretValue,
  );
  return NextResponse.json({ shopifyData, errors, extensions });
};

export const GET = getHandler;
