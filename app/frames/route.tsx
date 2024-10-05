import { Button } from "frames.js/next";
import { frames } from "./frames";

// React component for the image in the home fram, shown by default
const HomeImage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      To be approved as a member you need:
      <br />a Talent Passport with a Human checkmark and a Builder score &gt;
      50, a Basename, and to follow the caster and like this cast.
    </div>
  );
};

// Function for the buttons in the home fram, shown by default
const homeButtons = () => {
  return [
    <Button action="post" target={"/validate"}>
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
