import { Button } from "frames.js/next";
import { frames } from "../frames";
import { inviteUserToChannel } from "../../services/channel-member";
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

// Combined function for both approved and not approved cases
const userInfoImage = ({
  message,
  isHuman,
  basename,
  score,
  followingCaster,
  likesCast,
  isApproved,
  isFollower,
}: {
  message: any;
  isHuman: boolean;
  basename: string;
  score: number;
  followingCaster: boolean;
  likesCast: boolean;
  isApproved: boolean;
  isFollower: boolean;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div tw="flex">Name: {message?.requesterUserData?.displayName}</div>
      <div tw="flex">FID: {message?.requesterFid}</div>
      <div tw="flex">Human Checkmark: {isHuman ? "Yes" : "No"}</div>
      <div tw="flex">Basename: {basename || "N/A"}</div>
      <div tw="flex">Builder Score: {score ?? "N/A"}</div>
      <div tw="flex">Approved: {isApproved ? "Yes" : "No"}</div>
      <div tw="flex">
        Following the caster: {followingCaster ? "Yes" : "No"}
      </div>
      <div tw="flex">Likes the cast: {likesCast ? "Yes" : "No"}</div>
      <div tw="flex">Follower: {isFollower ? "Yes" : "No"}</div>
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
      target={"https://warpcast.com/~/notifications/channels"}
    >
      Accept Invite
    </Button>,
  ];
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

  // Update the state
  const updatedState = {
    isApproved:
      builder.hasWallet &&
      builder.hasPassport &&
      builder.isHuman &&
      builder.basename !== "N/A" &&
      builder.builderScore >= 50,
    isFollower: builder.followingCaster && builder.likesCast,
    channelId: ctx.state.channelId,
  };

  // Send invite to the approved signer
  if (updatedState.isApproved && updatedState.isFollower) {
    await inviteUserToChannel(
      updatedState.channelId,
      ctx.message?.requesterFid ?? 0,
      "member"
    );
  }

  // Use the combined userInfoImage function
  const imageFunction = userInfoImage;

  // Determine which buttons to use based on the updated state
  const buttonsFunction =
    updatedState.isApproved && updatedState.isFollower
      ? approvedButtons
      : notApprovedButtons;

  return {
    image: await imageFunction({
      message: ctx.message,
      isHuman: builder.isHuman,
      basename: builder.basename,
      score: builder.builderScore,
      followingCaster: builder.followingCaster,
      likesCast: builder.likesCast,
      isApproved: updatedState.isApproved,
      isFollower: updatedState.isFollower,
    }),
    buttons: buttonsFunction(),
    state: updatedState,
    imageOptions: {
      dynamic: true,
      aspectRatio: "1.91:1",
      headers: {
        "Cache-Control": "max-age=10",
      },
    },
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
