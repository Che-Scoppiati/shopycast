import { createShowcase, getShowcase, updateShowcase } from "@/lib/mongodb";
import { extractParamsFromUrl } from "@/lib/utils";
import { NextResponse } from "next/server";

const fetchShowcase = async (req: Request) => {
  console.log(req.url);
  const { shopId, showcaseId } = extractParamsFromUrl(req.url);

  const showcase = await getShowcase(shopId, showcaseId);

  return NextResponse.json({ showcase });
};

const editShowcase = async (req: Request) => {
  const { shopId, showcaseId } = extractParamsFromUrl(req.url);
  const body = await req.json();

  const showcase = await updateShowcase(shopId, showcaseId, body.products);

  return NextResponse.json({ showcase });
};

export const GET = fetchShowcase;
export const PUT = editShowcase;
