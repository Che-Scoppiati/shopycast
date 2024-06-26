import { addShop, getShopsByUser } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

const postHandler = async (req: NextRequest) => {
  const { user_id, shopName, shopUrl, secretName } = await req.json();
  const result = await addShop(user_id, shopName, shopUrl, secretName);
  return NextResponse.json({ shop: result });
};

const getHandler = async (req: NextRequest) => {
  // get user from query param
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const result = await getShopsByUser(searchParams.get("user_id") || "");
  return NextResponse.json({ shops: result });
};

export const GET = getHandler;
export const POST = postHandler;
