import { addUser } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const user = await req.json();
  const result = await addUser(user);
  console.log({ mongoUser: result });
  return NextResponse.json({ user: result });
};

export const POST = handler;
