import { Button } from "frames.js/next";
import { frames } from "./frames";
import { isUserInChannel } from "../services/channel-member";
import { BackgroundImage } from "../components/BackgroundImage";
import { appURL } from "@/lib/frames";
// React component for the initial frame image, shown by default
const initialImage = (channel: string) => {
  return (
    <BackgroundImage
      src={`${appURL()}/images/bg-image.png`}
      width="955px"
      height="500px"
    >
      <div tw="flex flex-col text-white justify-center items-center w-full h-full">
        <p
          style={{
            fontFamily: "Inter-Bold",
          }}
        >
          welcome to /{channel}
        </p>
      </div>
    </BackgroundImage>
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

  // load the channel id from the state
  const loadState = {
    channelId: ctx.state.channelId,
  };

  if (page === "initial") {
    return {
      image: initialImage(loadState.channelId),
      // buttons: initialButtons(),
      buttons: [
        {
          action: "post",
          target: { query: { page: "join" } },
          label: `Join /${loadState.channelId}`,
        },
        {
          action: "link",
          target:
            "https://talentprotocol.notion.site/How-it-works-115fc9bb53198006bb70d4418e45494f?pvs=4",
          label: "How it works",
        },
      ],
      imageOptions: {
        dynamic: true,
        aspectRatio: "1.91:1",
        headers: {
          "Cache-Control": "max-age=10",
        },
      },
    };
  }
  return {
    image: (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {(await isUserInChannel(
          ctx.message?.requesterFid ?? 0,
          loadState.channelId
        ))
          ? "You are a member of the channel."
          : "You are not a member of the channel yet."}
      </div>
    ),
    buttons: [
      (await isUserInChannel(
        ctx.message?.requesterFid ?? 0,
        loadState.channelId
      ))
        ? {
            action: "link",
            target: `https://warpcast.com/~/channel/${loadState.channelId}`,
            label: `Go to /${loadState.channelId}`,
          }
        : {
            action: "post",
            target: { query: { page: "join" }, pathname: "/validate" },
            label: `Ask for an invite to /${loadState.channelId}`,
          },
    ],
    imageOptions: {
      dynamic: true,
      aspectRatio: "1.91:1",
      headers: {
        "Cache-Control": "max-age=10",
      },
    },
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
