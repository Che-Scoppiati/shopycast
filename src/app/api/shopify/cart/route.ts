import { addShowcaseStatCheckout, getCart } from "@/lib/mongodb";
import { getShopifyCheckoutUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getHandler = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);

    const userFid = searchParams.get("userFid") || "";
    const shopUrl = searchParams.get("shopUrl") || "";
    const referrerFid = searchParams.get("referrerFid") || "";
    const shopId = searchParams.get("shopId") || "";
    const showcaseId = searchParams.get("showcaseId") || "";
    const referrerCastHash = searchParams.get("referrerCastHash") || "";

    if (
      !shopUrl ||
      !referrerFid ||
      !userFid ||
      !shopId ||
      !showcaseId ||
      !referrerCastHash
    ) {
      return NextResponse.json({ error: "missing args" });
    }

    const cart = await getCart(userFid, shopId, showcaseId);

    // // save checkout stat
    // await addShowcaseStatCheckout(
    //   showcaseId,
    //   referrerCastHash,
    //   cart?.products,
    //   parseInt(userFid),
    //   referrerFid,
    // );

    const shopifyCheckoutUrl = getShopifyCheckoutUrl(
      shopUrl,
      cart,
      referrerFid,
    );

    return NextResponse.redirect(shopifyCheckoutUrl);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    console.error(errorMessage);
    return NextResponse.json({ error: errorMessage });
  }
};

export const GET = getHandler;
