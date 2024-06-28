import { imageOptions } from "@/lib/frames";
import { createImagesWorker } from "frames.js/middleware/images-worker/next";
import * as path from "node:path";
import fs from "node:fs";

const regularFontData = fs.readFileSync(
  path.join(process.cwd(), "public/assets", "Outfit-Regular.ttf"),
);

const boldFontData = fs.readFileSync(
  path.join(process.cwd(), "public/assets", "Outfit-Bold.ttf"),
);

const extraBoldFontData = fs.readFileSync(
  path.join(process.cwd(), "public/assets", "Outfit-ExtraBold.ttf"),
);

const imagesRoute = createImagesWorker({
  secret: process.env.IMAGE_WORKER_SECRET,
  ...imageOptions,
  imageOptions: {
    debug: true,
    fonts: [
      {
        data: regularFontData,
        name: "Outfit-Regular",
      },
      {
        data: boldFontData,
        name: "Outfit-Bold",
      },
      {
        data: extraBoldFontData,
        name: "Outfit-ExtraBold",
      },
    ],
  },
});

export const GET = imagesRoute();
