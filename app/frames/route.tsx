import { Button } from "frames.js/next";
import { frames } from "./frames";
import {
  getTalentProtocolUser,
  getCredentialsForPassport,
  PassportCredentials,
} from "@/lib/talent-protocol";

// React component for the image in the home fram, shown by default
const HomeImage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      @macedo's first frame!
    </div>
  );
};

// Function for the buttons in the home fram, shown by default
const homeButtons = () => {
  return [
    <Button action="post" target={"/approved"}>
      Join /ubi
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
  return {
    image: <HomeImage />,
    buttons: homeButtons(),
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
