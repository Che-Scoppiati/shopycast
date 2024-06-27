import { addUser, getUser } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

const postHandler = async (req: NextRequest) => {
  const user = await req.json();
  const result = await addUser(user);
  console.log({ mongoUser: result });
  return NextResponse.json({ user: result });
};

const getHandler = async (req: NextRequest) => {
  // get user from query param
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const result = await getUser(searchParams.get("user_id") || "");
  return NextResponse.json({ user: result });
};

export const GET = getHandler;
export const POST = postHandler;
