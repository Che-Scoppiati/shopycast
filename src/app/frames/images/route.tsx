import { createImagesWorker } from "frames.js/middleware/images-worker/next";

const imagesRoute = createImagesWorker({
  secret: process.env.IMAGE_WORKER_SECRET,
});

export const GET = imagesRoute();
