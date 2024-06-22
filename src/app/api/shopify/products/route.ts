import { getAllProducts } from "@/lib/shopify";
import { NextResponse } from "next/server";

const handler = async (req: Request) => {
  const { shopifyData, errors, extensions } = await getAllProducts();
  return NextResponse.json({ shopifyData, errors, extensions });
};

export const GET = handler;
