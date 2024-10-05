import { MembersResponse } from "./types";

export const isUserInChannel = async (
  fid: number,
  channelId: string
): Promise<boolean> => {
  const url = `https://api.warpcast.com/fc/channel-members?channelId=${channelId}`;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, { headers });
    const data = (await response.json()) as MembersResponse;

    // Check if the user's FID is in the list of member FIDs
    return data.result.members.some((member) => member.fid === fid);
  } catch (error) {
    console.error(error);
    return false;
  }
};
