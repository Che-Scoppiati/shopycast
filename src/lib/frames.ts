import fs from "node:fs";
import * as path from "node:path";
import { headers } from "next/headers";
import { appURL } from "./utils";

const DEFAULT_DEBUGGER_URL =
  process.env.DEBUGGER_URL ?? "http://localhost:3010/";

export const DEFAULT_DEBUGGER_HUB_URL =
  process.env.NODE_ENV === "development"
    ? new URL("/hub", DEFAULT_DEBUGGER_URL).toString()
    : undefined;

export function currentURL(pathname: string): URL {
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  try {
    return new URL(pathname, `${protocol}://${host}`);
  } catch (error) {
    return new URL("http://localhost:3000");
  }
}

export function createDebugUrl(frameURL: string | URL): string {
  try {
    const url = new URL("/", DEFAULT_DEBUGGER_URL);

    url.searchParams.set("url", frameURL.toString());

    return url.toString();
  } catch (error) {
    return "#";
  }
}

export const FRAMES_BASE_PATH = "/frames";

const regularFontData = fs.readFileSync(
  path.join(process.cwd(), "public/assets", "Outfit-Regular.ttf"),
);

const boldFontData = fs.readFileSync(
  path.join(process.cwd(), "public/assets", "Outfit-Bold.ttf"),
);
export const imageOptions = {
  debug: false,
  width: 1080,
  height: 1080,
  fonts: [
    {
      data: regularFontData,
      name: "Outfit-Regular",
    },
    {
      data: boldFontData,
      name: "Outfit-Bold",
    },
  ],
};

export function extractParamsFromUrl(url: string) {
  const urlWithoutBase = url
    .replace(appURL(), "") // this is not included inside pathname
    .replace(FRAMES_BASE_PATH, "")
    .replace("api/", "")
    .replace("showcases/", "");
  const urlParts = urlWithoutBase.split("/").filter((part) => part !== "");
  return {
    shopId: urlParts[0],
    showcaseId: urlParts[1] ?? undefined,
    productId: urlParts[2] ?? undefined,
  };
}

export { appURL };
