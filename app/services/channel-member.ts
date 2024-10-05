import { MembersResponse } from "./types";
import { NobleEd25519Signer } from "@farcaster/hub-nodejs";

function hexToUint8Array(hexString: string): Uint8Array {
  return new Uint8Array(
    hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
}

const generateAuthToken = async () => {
  const fid = Number(process.env.FARCASTER_BOT_FID);
  const privateKeyHex = process.env.FARCASTER_BOT_PRIVATE_KEY;

  if (!privateKeyHex || privateKeyHex.length === 0) {
    throw new Error("FARCASTER_BOT_PRIVATE_KEY is not set or is empty");
  }

  if (privateKeyHex.length !== 32) {
    throw new Error(
      `Invalid private key length: expected 32 bytes, got ${privateKeyHex.length}`
    );
  }

  const publicKey = Buffer.from(
    process.env.FARCASTER_BOT_PUBLIC_KEY as string,
    "hex"
  );

  const privateKeyBytes = hexToUint8Array(privateKeyHex);
  console.log("privateKeyHex", privateKeyHex);
  console.log("privateKeyBytes", privateKeyBytes);

  const signer = new NobleEd25519Signer(privateKeyBytes);

  const header = {
    fid,
    type: "app_key",
    key: publicKey,
  };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );

  const payload = { exp: Math.floor(Date.now() / 1000) + 300 }; // 5 minutes
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  const signatureResult = await signer.signMessageHash(
    Buffer.from(`${encodedHeader}.${encodedPayload}`, "utf-8")
  );
  if (signatureResult.isOk()) {
    const encodedSignature = Buffer.from(signatureResult.value).toString(
      "base64url"
    );
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  } else {
    throw new Error(`Failed to sign message: ${signatureResult.error}`);
  }
};

export const inviteUserToChannel = async (
  channelId: string,
  inviteFid: number,
  role: "member" | "moderator" = "member"
) => {
  const authToken = await generateAuthToken();

  const response = await fetch("https://api.warpcast.com/fc/channel-invites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ channelId, inviteFid, role }),
  });

  if (!response.ok) {
    throw new Error(`Failed to invite user: ${response.statusText}`);
  }

  return await response.json();
};

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
