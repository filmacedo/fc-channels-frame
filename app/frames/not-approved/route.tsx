import { Button } from "frames.js/next";
import { frames } from "../frames";

const handleRequest = frames(async (ctx) => {
  const button = ctx.message?.buttonIndex;
  const address = (await ctx.walletAddress()) || "No address";

  return {
    image: (
      <div tw="flex flex-col">
        <div tw="flex">You clicked button: {button}</div>
        <div tw="flex">Your address: {address}</div>
      </div>
    ),
    buttons: [
      <Button action="post" target={"/"}>
        Back
      </Button>,
    ],
    imageOptions: {
      dynamic: true,
      headers: {
        "Cache-Control": "max-age=10",
      },
    },
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
