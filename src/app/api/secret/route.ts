import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const { secretName } = await req.json();

  const { secretValue, error } = await fetch(
    `${process.env.BACKEND_URL}/secret/${secretName}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACKEND_API_KEY || "",
      },
    },
  ).then((res) => res.json());

  if (error) {
    return NextResponse.error();
  }
  return NextResponse.json({ secretValue: secretValue });
};

export const POST = handler;
