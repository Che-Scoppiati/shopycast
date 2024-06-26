import { imageOptions } from "@/lib/frames";
import { createImagesWorker } from "frames.js/middleware/images-worker/next";

const imagesRoute = createImagesWorker({
  secret: process.env.IMAGE_WORKER_SECRET,
  ...imageOptions,
  imageOptions: {
    debug: true,
  },
});

export const GET = imagesRoute();
