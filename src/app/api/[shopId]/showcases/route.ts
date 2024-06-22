import { createShowcase, getAllShowcases } from "@/lib/mongodb";
import { extractParamsFromUrl } from "@/lib/utils";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const fetchShowCases = async (req: NextApiRequest) => {
  const { shopId } = extractParamsFromUrl(req.url!);

  const showcases = await getAllShowcases(shopId);

  return NextResponse.json(showcases);
};

const postShowCase = async (req: NextApiRequest) => {
  const { shopId } = extractParamsFromUrl(req.url!);
  const body = req.body;

  const showcase = await createShowcase(shopId, body.products);

  return NextResponse.json(showcase);
};

export const GET = fetchShowCases;
export const POST = postShowCase;
