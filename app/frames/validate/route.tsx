import { Button } from "frames.js/next";
import { frames } from "../frames";
import {
  getTalentProtocolUser,
  getCredentialsForPassport,
  PassportCredentials,
} from "@/lib/talent-protocol";

// function to validate if the user is approved as member; returns a boolean for wallet, passporthuman checkmark, basename and a score for builder score
const validateUser = async ({ message }: { message: any }) => {
  const wallet = message.requesterVerifiedAddresses?.[0] ?? "";
  let passport = null;
  let credentials: PassportCredentials["passport_credentials"] = [];
  let builderScore = 0;
  let isHuman = false;
  let basename = "N/A";

  console.log("User Address (validateUser): ", wallet);

  if (wallet) {
    passport = await getTalentProtocolUser(wallet);

    if (passport) {
      credentials = await getCredentialsForPassport(passport.passport_id);
      isHuman = passport.human_checkmark ?? false;
      console.log("Is Human: ", isHuman);
      builderScore = passport.score ?? 0;
      basename =
        credentials.find((credential) => credential.name === "Basename")
          ?.value ?? "N/A";
      return {
        isHuman,
        basename,
        builderScore,
        hasWallet: true,
        hasPassport: true,
      };
    } else {
      return {
        // Early return if no passport is found
        isHuman,
        basename,
        builderScore,
        hasWallet: true,
        hasPassport: false,
      };
    }
  } else {
    return {
      // Early return if no wallet address is found
      isHuman,
      basename,
      builderScore,
      hasWallet: false,
      hasPassport: false,
    };
  }
};

// Function for the image when the user is approved
const approvedImage = async ({
  message,
  isHuman,
  basename,
  score,
}: {
  message: any;
  isHuman: boolean;
  basename: string;
  score: number;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div tw="flex">Name: {message?.requesterUserData?.displayName}</div>
      <div tw="flex">FID: {message?.requesterFid}</div>
      <div tw="flex">Human Checkmark: {isHuman ? "Yes" : "No"}</div>
      <div tw="flex">Basename: {basename || "N/A"}</div>
      <div tw="flex">Builder Score: {score ?? "N/A"}</div>
      <div tw="flex">Approved!</div>
    </div>
  );
};

// Function for the buttons when the user is approved
const approvedButtons = () => {
  return [
    <Button action="post" target={"/"}>
      Back
    </Button>,
    <Button
      action="link"
      target={"https://warpcast.com/~/compose?text=Test&channelKey=ubi"}
    >
      Start Casting
    </Button>,
  ];
};

// Function for the image when the user is NOT approved
const notApprovedImage = async ({
  message,
  isHuman,
  basename,
  score,
}: {
  message: any;
  isHuman: boolean;
  basename: string | undefined;
  score: number | undefined;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div tw="flex">Name: {message?.requesterUserData?.displayName}</div>
      <div tw="flex">FID: {message?.requesterFid}</div>
      <div tw="flex">Human Checkmark: {isHuman ? "Yes" : "No"}</div>
      <div tw="flex">Basename: {basename || "N/A"}</div>
      <div tw="flex">Builder Score: {score ?? "N/A"}</div>
      <div tw="flex">Not Approved!</div>
    </div>
  );
};

// Function for the buttons when the user is NOT approved
const notApprovedButtons = () => {
  return [
    <Button action="post" target={"/"}>
      Back
    </Button>,
    <Button action="link" target={"https://talentprotocol.com"}>
      Create Talent Passport
    </Button>,
  ];
};

const handleRequest = frames(async (ctx) => {
  const { isHuman, basename, builderScore, hasWallet, hasPassport } =
    await validateUser({ message: ctx.message });

  // return approved image if the user is human AND has a basename credential
  if (hasWallet && hasPassport && isHuman && basename && builderScore >= 20) {
    return {
      image: await approvedImage({
        message: ctx.message,
        isHuman: isHuman,
        basename: basename,
        score: builderScore,
      }),
      buttons: approvedButtons(),
      imageOptions: {
        dynamic: true,
        headers: {
          "Cache-Control": "max-age=10",
        },
      },
    };
  } else {
    return {
      image: await notApprovedImage({
        message: ctx.message,
        isHuman: isHuman,
        basename: basename,
        score: builderScore,
      }),
      buttons: notApprovedButtons(),
      imageOptions: {
        dynamic: true,
        headers: {
          "Cache-Control": "max-age=10",
        },
      },
    };
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
