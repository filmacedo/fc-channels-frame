import { createImagesWorker } from "frames.js/middleware/images-worker/next";
import * as path from "node:path";
import fs from "node:fs";

const regularFontData = fs.readFileSync(
  path.join(process.cwd(), "public/fonts", "Inter-Regular.ttf")
);

const boldFontData = fs.readFileSync(
  path.join(process.cwd(), "public/fonts", "Inter-Bold.ttf")
);

const extraFontData1 = fs.readFileSync(
  path.join(process.cwd(), "public/fonts", "SixtyfourConvergence-Regular.ttf")
);

const extraFontData2 = fs.readFileSync(
  path.join(process.cwd(), "public/fonts", "FiraCodeiScript-Regular.ttf")
);

const imagesRoute = createImagesWorker({
  secret: "talent",
  imageOptions: {
    sizes: {
      "1.91:1": {
        width: 955,
        height: 500,
      },
      "1:1": {
        width: 1080,
        height: 1080,
      },
    },
    fonts: [
      {
        data: regularFontData,
        name: "Inter-Regular",
      },
      {
        data: boldFontData,
        name: "Inter-Bold",
      },
      {
        data: extraFontData1,
        name: "SixtyfourConvergence-Regular",
      },
      {
        data: extraFontData2,
        name: "FiraCodeiScript-Regular",
      },
    ],
  },
});

export const GET = imagesRoute();
