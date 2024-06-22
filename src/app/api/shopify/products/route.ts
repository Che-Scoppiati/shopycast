import { getAllProducts } from "@/lib/shopify";
import { NextResponse } from "next/server";

const handler = async (req: Request) => {
  const { shopifyData, errors } = await getAllProducts();
  return NextResponse.json({ shopifyData, errors });
};

export const GET = handler;
