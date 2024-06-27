import { getAllProducts } from "@/lib/shopify";
import { appURL } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const postHandler = async (req: NextRequest) => {
  try {
    const { user_id, shop_id } = await req.json();

    if (!user_id || !shop_id) {
      return NextResponse.json({ error: "missing args" });
    }

    // 1. fetch shop
    const { shop } = await fetch(
      `${appURL()}/api/shops?user_id=${user_id}&shop_id=${shop_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => res.json());
    if (!shop) {
      return NextResponse.json({ error: "shop not found" });
    }

    // 2. fetch shop api key
    const { secretValue } = await fetch(
      `${appURL()}/api/secret?secretName=${shop.secretName}`,
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
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    console.error(errorMessage);
    return NextResponse.json({ error: errorMessage });
  }
};

export const POST = postHandler;
