import { createShowcase, getAllShowcasesWithDetails } from "@/lib/mongodb";
import { extractParamsFromUrl } from "@/lib/frames";
import { NextRequest, NextResponse } from "next/server";

const fetchShowCases = async (req: NextRequest) => {
  const { shopId } = extractParamsFromUrl(req.url!);

  const showcases = await getAllShowcasesWithDetails(shopId);

  return NextResponse.json({
    showcases,
  });
};

const postShowCase = async (req: NextRequest) => {
  const { shopId } = extractParamsFromUrl(req.url!);
  const body = await req.json();

  const showcase = await createShowcase(shopId, body.productIds, body.name);

  return NextResponse.json({
    showcase,
  });
};

export const GET = fetchShowCases;
export const POST = postShowCase;
