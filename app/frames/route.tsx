import { Button } from "frames.js/next";
import { frames } from "./frames";
import { isUserInChannel } from "../services/channel-member";
// React component for the initial frame image, shown by default
const initialImage = (channel: string) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      welcome to /{channel}
    </div>
  );
};

// Function for the buttons in the home fram, shown by default
const initialButtons = () => {
  return [
    <Button
      action="post"
      target={{ query: { page: "join" }, pathname: "/validate" }}
    >
      Join /channel
    </Button>,
    <Button
      action="link"
      target={
        "https://talentprotocol.notion.site/How-it-works-115fc9bb53198006bb70d4418e45494f?pvs=4"
      }
    >
      How it works
    </Button>,
  ];
};

const handleRequest = frames(async (ctx) => {
  const page = ctx.searchParams?.page ?? "initial";
  let channel = "build";

  if (page === "initial") {
    return {
      image: initialImage(channel),
      // buttons: initialButtons(),
      buttons: [
        {
          action: "post",
          target: { query: { page: "join" } },
          label: `Join /${channel}`,
        },
        {
          action: "link",
          target:
            "https://talentprotocol.notion.site/How-it-works-115fc9bb53198006bb70d4418e45494f?pvs=4",
          label: "How it works",
        },
      ],
    };
  }
  return {
    image: (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {(await isUserInChannel(ctx.message?.requesterFid ?? 0, channel))
          ? "You are a member of the channel."
          : "You are not a member of the channel yet."}
      </div>
    ),
    buttons: [
      (await isUserInChannel(ctx.message?.requesterFid ?? 0, channel))
        ? {
            action: "link",
            target: `https://warpcast.com/~/channel/${channel}`,
            label: `Go to /${channel}`,
          }
        : {
            action: "post",
            target: { query: { page: "join" }, pathname: "/validate" },
            label: `Ask for an invite to /${channel}`,
          },
    ],
  };
});

/* const handleRequest = frames(async (ctx) => {
  return {
    image: <InitialImage />,
    buttons: initialButtons(),
  };
}); */

export const GET = handleRequest;
export const POST = handleRequest;
