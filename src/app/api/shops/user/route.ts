import { getShopsByUser } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

const getHandler = async (req: NextRequest) => {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);

  const user_id = searchParams.get("user_id") || "";

  const data = await getShopsByUser(user_id);
  return NextResponse.json({ shops: data });
};

export const GET = getHandler;
