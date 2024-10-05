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
  const followingCaster = message?.requesterFollowsCaster ?? false;
  const likesCast = message?.likedCast ?? false;
  let passport = null;
  let credentials: PassportCredentials["passport_credentials"] = [];
  let builderScore = 0;
  let isHuman = false;
  let basename = "N/A";

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
        hasWallet: true,
        hasPassport: true,
        builderScore,
        isHuman,
        basename,
        followingCaster,
        likesCast,
      };
    } else {
      return {
        // Early return if no passport is found
        hasWallet: true,
        hasPassport: false,
        builderScore,
        isHuman,
        basename,
        followingCaster,
        likesCast,
      };
    }
  } else {
    return {
      // Early return if no wallet address is found
      hasWallet: false,
      hasPassport: false,
      builderScore,
      isHuman,
      basename,
      followingCaster,
      likesCast,
    };
  }
};

// Function for the image when the user is approved
const approvedImage = ({
  message,
  isHuman,
  basename,
  score,
  followingCaster,
  likesCast,
}: {
  message: any;
  isHuman: boolean;
  basename: string;
  score: number;
  followingCaster: boolean;
  likesCast: boolean;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div tw="flex">Name: {message?.requesterUserData?.displayName}</div>
      <div tw="flex">FID: {message?.requesterFid}</div>
      <div tw="flex">Human Checkmark: {isHuman ? "Yes" : "No"}</div>
      <div tw="flex">Basename: {basename || "N/A"}</div>
      <div tw="flex">Builder Score: {score ?? "N/A"}</div>
      <div tw="flex">
        Following the caster: {followingCaster ? "Yes" : "No"}
      </div>
      <div tw="flex">Likes the cast: {likesCast ? "Yes" : "No"}</div>
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
const notApprovedImage = ({
  message,
  isHuman,
  basename,
  score,
  followingCaster,
  likesCast,
}: {
  message: any;
  isHuman: boolean;
  basename: string | undefined;
  score: number | undefined;
  followingCaster: boolean;
  likesCast: boolean;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div tw="flex">Name: {message?.requesterUserData?.displayName}</div>
      <div tw="flex">FID: {message?.requesterFid}</div>
      <div tw="flex">Human Checkmark: {isHuman ? "Yes" : "No"}</div>
      <div tw="flex">Basename: {basename || "N/A"}</div>
      <div tw="flex">Builder Score: {score ?? "N/A"}</div>
      <div tw="flex">
        Following the caster: {followingCaster ? "Yes" : "No"}
      </div>
      <div tw="flex">Likes the cast: {likesCast ? "Yes" : "No"}</div>
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
    <Button action="post" target={"/validate"}>
      Check again
    </Button>,
    <Button action="link" target={"https://passport.talentprotocol.com/"}>
      Builder Score
    </Button>,
    <Button
      action="link"
      target={
        "https://docs.talentprotocol.com/docs/talent-passport/human-checkmark"
      }
    >
      Human Checkmark
    </Button>,
  ];
};

const handleRequest = frames(async (ctx) => {
  const builder = await validateUser({ message: ctx.message });

  // return approved image if the user is human AND has a basename credential
  if (
    builder.hasWallet &&
    builder.hasPassport &&
    builder.isHuman &&
    builder.basename &&
    builder.followingCaster &&
    builder.likesCast &&
    builder.builderScore >= 50
  ) {
    return {
      image: await approvedImage({
        message: ctx.message,
        isHuman: builder.isHuman,
        basename: builder.basename,
        score: builder.builderScore,
        followingCaster: builder.followingCaster,
        likesCast: builder.likesCast,
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
        isHuman: builder.isHuman,
        basename: builder.basename,
        score: builder.builderScore,
        followingCaster: builder.followingCaster,
        likesCast: builder.likesCast,
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
