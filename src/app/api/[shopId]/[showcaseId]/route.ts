import { createShowcase } from "@/lib/mongodb";
import { extractParamsFromUrl } from "@/lib/utils";
import { NextResponse } from "next/server";

const fetchShowCase = async (req: Request) => {
  console.log(req.url);
  const { shopId, showcaseId } = extractParamsFromUrl(req.url);

  return NextResponse.json({ shopId, showcaseId });
};

export const GET = fetchShowCase;
