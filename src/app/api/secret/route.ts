import { NextRequest, NextResponse } from "next/server";

const getHandler = async (req: NextRequest) => {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);

  const secretName = searchParams.get("secretName") || "";

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

const postHandler = async (req: NextRequest) => {
  const { secretName, secretValue } = await req.json();

  const { secretName: newSecretName, error } = await fetch(
    `${process.env.BACKEND_URL}/secret`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACKEND_API_KEY || "",
      },
      body: JSON.stringify({ secretName, secretValue }),
    },
  ).then((res) => res.json());

  if (error) {
    return NextResponse.error();
  }
  return NextResponse.json({ secretName: newSecretName });
};

const deleteHandler = async (req: NextRequest) => {
  const { secretName } = await req.json();

  const { secretName: newSecretName, error } = await fetch(
    `${process.env.BACKEND_URL}/secret`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACKEND_API_KEY || "",
      },
      body: JSON.stringify({ secretName }),
    },
  ).then((res) => res.json());

  if (error) {
    return NextResponse.error();
  }
  return NextResponse.json({ secretName: newSecretName });
};

const putHandler = async (req: NextRequest) => {
  const { secretName, secretValue } = await req.json();

  const { secretName: newSecretName, error } = await fetch(
    `${process.env.BACKEND_URL}/secret`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACKEND_API_KEY || "",
      },
      body: JSON.stringify({ secretName, secretValue }),
    },
  ).then((res) => res.json());

  if (error) {
    return NextResponse.error();
  }
  return NextResponse.json({ secretName: newSecretName });
};

export const GET = getHandler;
export const POST = postHandler;
export const DELETE = deleteHandler;
export const PUT = putHandler;
