import { deleteShowcase, getShowcase, updateShowcase } from "@/lib/mongodb";
import { extractParamsFromUrl } from "@/lib/frames";
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

  // if products is empty, delete the showcase
  if (body.products.length === 0) {
    const showcase = await deleteShowcase(shopId, showcaseId);
    return NextResponse.json({ showcase });
  }

  const showcase = await updateShowcase(
    shopId,
    showcaseId,
    body.products,
    body.name,
  );

  return NextResponse.json({ showcase });
};

const removeShowcase = async (req: Request) => {
  const { shopId, showcaseId } = extractParamsFromUrl(req.url);

  let showcase = await deleteShowcase(shopId, showcaseId);

  return NextResponse.json({ showcase });
};

export const GET = fetchShowcase;
export const PUT = editShowcase;
export const DELETE = removeShowcase;
